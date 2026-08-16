import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  DetectDuplicatesDto,
  ReviewMatchDto,
  MergeContactsDto,
  RevertMergeDto,
  SearchMatchesDto,
} from './dto/identity.dto';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── DUPLICATE DETECTION ────────────────────────────

  async detectDuplicates(tenantId: string, dto: DetectDuplicatesDto) {
    const minConfidence = dto.minConfidence || 0.5;
    const matches: Array<{ sourceId: string; targetId: string; score: number; criteria: any }> = [];

    if (dto.contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: { id: dto.contactId, tenantId, deletedAt: null },
      });
      if (!contact) throw new NotFoundException(`Contacto ${dto.contactId} no encontrado`);

      const candidates = await this.findMatchingContacts(tenantId, contact, minConfidence);
      matches.push(...candidates);
    } else {
      const contacts = await this.prisma.contact.findMany({
        where: { tenantId, deletedAt: null },
        take: 500,
      });

      for (const contact of contacts) {
        const candidates = await this.findMatchingContacts(tenantId, contact, minConfidence);
        matches.push(...candidates);
      }
    }

    const uniqueMatches = this.deduplicateMatches(matches);

    for (const match of uniqueMatches) {
      await this.prisma.contactMatchCandidate.upsert({
        where: {
          sourceContactId_targetContactId: {
            sourceContactId: match.sourceId,
            targetContactId: match.targetId,
          },
        },
        update: {
          confidenceScore: match.score,
          matchCriteria: match.criteria,
        },
        create: {
          tenantId,
          sourceContactId: match.sourceId,
          targetContactId: match.targetId,
          matchType: match.score >= 0.95 ? 'EXACT' : match.score >= 0.7 ? 'PROBABLE' : 'FUZZY',
          confidenceScore: match.score,
          matchCriteria: match.criteria,
        },
      });
    }

    return { detected: uniqueMatches.length, matches: uniqueMatches };
  }

  private async findMatchingContacts(
    tenantId: string,
    contact: any,
    minConfidence: number,
  ) {
    const candidates: Array<{ sourceId: string; targetId: string; score: number; criteria: any }> = [];

    const orConditions: Prisma.ContactWhereInput[] = [];

    if (contact.email) {
      orConditions.push({ email: contact.email, id: { not: contact.id } });
    }

    if (contact.phone) {
      orConditions.push({ phone: contact.phone, id: { not: contact.id } });
    }

    if (contact.firstName && contact.lastName) {
      orConditions.push({
        firstName: contact.firstName,
        lastName: contact.lastName,
        id: { not: contact.id },
      });
    }

    if (orConditions.length === 0) return candidates;

    const potentialMatches = await this.prisma.contact.findMany({
      where: {
        tenantId,
        deletedAt: null,
        id: { not: contact.id },
        OR: orConditions,
      },
      take: 50,
    });

    for (const match of potentialMatches) {
      const score = this.calculateMatchScore(contact, match);
      if (score >= minConfidence) {
        candidates.push({
          sourceId: contact.id,
          targetId: match.id,
          score,
          criteria: this.getMatchCriteria(contact, match),
        });
      }
    }

    return candidates;
  }

  private calculateMatchScore(a: any, b: any): number {
    let score = 0;
    let factors = 0;

    if (a.email && b.email) {
      factors++;
      if (a.email.toLowerCase() === b.email.toLowerCase()) score += 0.4;
      else if (a.email.toLowerCase().includes(b.email.toLowerCase()) ||
               b.email.toLowerCase().includes(a.email.toLowerCase())) {
        score += 0.2;
      }
    }

    if (a.phone && b.phone) {
      factors++;
      const normalizePhone = (p: string) => p.replace(/[^0-9]/g, '');
      if (normalizePhone(a.phone) === normalizePhone(b.phone)) score += 0.3;
    }

    if (a.firstName && b.firstName) {
      factors++;
      if (a.firstName.toLowerCase() === b.firstName.toLowerCase()) score += 0.15;
    }

    if (a.lastName && b.lastName) {
      factors++;
      if (a.lastName.toLowerCase() === b.lastName.toLowerCase()) score += 0.15;
    }

    return factors > 0 ? Math.min(score, 1) : 0;
  }

  private getMatchCriteria(a: any, b: any): any {
    return {
      email: a.email && b.email ? a.email.toLowerCase() === b.email.toLowerCase() : false,
      phone: a.phone && b.phone ? a.phone.replace(/[^0-9]/g, '') === b.phone.replace(/[^0-9]/g, '') : false,
      firstName: a.firstName && b.firstName ? a.firstName.toLowerCase() === b.firstName.toLowerCase() : false,
      lastName: a.lastName && b.lastName ? a.lastName.toLowerCase() === b.lastName.toLowerCase() : false,
    };
  }

  private deduplicateMatches(matches: Array<{ sourceId: string; targetId: string; score: number; criteria: any }>) {
    const seen = new Set<string>();
    return matches.filter((m) => {
      const key = [m.sourceId, m.targetId].sort().join('-');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ─── MATCH CANDIDATES ───────────────────────────────

  async findMatchCandidates(tenantId: string, params: SearchMatchesDto) {
    const where: Prisma.ContactMatchCandidateWhereInput = { tenantId };

    if (params.status) where.status = params.status;
    if (params.matchType) where.matchType = params.matchType;

    return this.prisma.contactMatchCandidate.findMany({
      where,
      skip: parseInt(params.skip || '0', 10),
      take: parseInt(params.take || '20', 10),
      include: {
        sourceContact: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        targetContact: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
      orderBy: { confidenceScore: 'desc' },
    });
  }

  async reviewMatch(tenantId: string, id: string, dto: ReviewMatchDto) {
    const match = await this.prisma.contactMatchCandidate.findFirst({
      where: { id, tenantId },
    });
    if (!match) throw new NotFoundException(`Match ${id} no encontrado`);

    return this.prisma.contactMatchCandidate.update({
      where: { id },
      data: {
        status: dto.status,
        dismissReason: dto.dismissReason,
        reviewedAt: new Date(),
      },
    });
  }

  // ─── MERGE CONTACTS ─────────────────────────────────

  async mergeContacts(tenantId: string, dto: MergeContactsDto) {
    const [source, target] = await Promise.all([
      this.prisma.contact.findFirst({ where: { id: dto.sourceContactId, tenantId, deletedAt: null } }),
      this.prisma.contact.findFirst({ where: { id: dto.targetContactId, tenantId, deletedAt: null } }),
    ]);

    if (!source) throw new NotFoundException(`Contacto fuente ${dto.sourceContactId} no encontrado`);
    if (!target) throw new NotFoundException(`Contacto destino ${dto.targetContactId} no encontrado`);
    if (source.id === target.id) throw new BadRequestException('No se puede fusionar un contacto consigo mismo');

    const strategy = dto.mergeStrategy || 'KEEP_TARGET';
    const backupData = this.createBackupSnapshot(source);
    const mergedData = this.mergeData(source, target, strategy, dto.fieldOverrides);

    await this.prisma.contact.update({
      where: { id: target.id },
      data: mergedData,
    });

    await this.prisma.contact.update({
      where: { id: source.id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.contactMatchCandidate.updateMany({
      where: {
        OR: [
          { sourceContactId: source.id },
          { targetContactId: source.id },
        ],
      },
      data: { status: 'MERGED' },
    });

    const history = await this.prisma.contactMergeHistory.create({
      data: {
        tenantId,
        sourceContactId: source.id,
        targetContactId: target.id,
        mergeStrategy: strategy,
        mergedData: mergedData as any,
        backupData: backupData as any,
      },
    });

    return { success: true, mergeHistoryId: history.id, mergedContact: { id: target.id, ...mergedData } };
  }

  private createBackupSnapshot(contact: any) {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      mobile: contact.mobile,
      jobTitle: contact.jobTitle,
      department: contact.department,
      address: contact.address,
      city: contact.city,
      countryCode: contact.countryCode,
      leadSource: contact.leadSource,
      status: contact.status,
      tags: contact.tags,
      score: contact.score,
    };
  }

  private mergeData(source: any, target: any, strategy: string, overrides?: Record<string, string>) {
    const merged: any = {};

    const fields = ['firstName', 'lastName', 'email', 'phone', 'mobile', 'jobTitle', 'department', 'address', 'city', 'countryCode', 'leadSource', 'status', 'score'];

    for (const field of fields) {
      if (overrides && overrides[field]) {
        merged[field] = overrides[field] === 'source' ? source[field] : target[field];
      } else if (strategy === 'KEEP_SOURCE') {
        merged[field] = source[field] || target[field];
      } else {
        merged[field] = target[field] || source[field];
      }
    }

    const sourceTags = source.tags || [];
    const targetTags = target.tags || [];
    merged.tags = [...new Set([...targetTags, ...sourceTags])];

    merged.score = Math.max(source.score || 0, target.score || 0);

    return merged;
  }

  // ─── MERGE HISTORY ──────────────────────────────────

  async getMergeHistory(tenantId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.contactMergeHistory.findMany({
      where: { tenantId },
      skip: params?.skip || 0,
      take: params?.take || 50,
      include: {
        sourceContact: { select: { id: true, firstName: true, lastName: true, email: true } },
        targetContact: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMergeHistoryById(tenantId: string, id: string) {
    const history = await this.prisma.contactMergeHistory.findFirst({
      where: { id, tenantId },
      include: {
        sourceContact: { select: { id: true, firstName: true, lastName: true, email: true } },
        targetContact: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!history) throw new NotFoundException(`Historial de fusión ${id} no encontrado`);
    return history;
  }

  async revertMerge(tenantId: string, dto: RevertMergeDto) {
    const history = await this.getMergeHistoryById(tenantId, dto.mergeHistoryId);

    if (history.status === 'REVERTED') throw new ConflictException('Esta fusión ya fue revertida');
    if (!history.backupData) throw new BadRequestException('No hay datos de respaldo para revertir');

    const backup = history.backupData as any;

    await this.prisma.contact.update({
      where: { id: history.sourceContactId },
      data: {
        deletedAt: null,
        firstName: backup.firstName,
        lastName: backup.lastName,
        email: backup.email,
        phone: backup.phone,
        mobile: backup.mobile,
        jobTitle: backup.jobTitle,
        department: backup.department,
        address: backup.address,
        city: backup.city,
        countryCode: backup.countryCode,
        leadSource: backup.leadSource,
        status: backup.status,
        tags: backup.tags || [],
        score: backup.score,
      },
    });

    await this.prisma.contactMergeHistory.update({
      where: { id: dto.mergeHistoryId },
      data: {
        status: 'REVERTED',
        revertedAt: new Date(),
        revertReason: dto.reason,
      },
    });

    return { success: true, restoredContactId: history.sourceContactId };
  }

  // ─── STATS ──────────────────────────────────────────

  async getIdentityStats(tenantId: string) {
    const [totalMatches, pendingMatches, mergedMatches, dismissedMatches, totalMerges, revertedMerges] = await Promise.all([
      this.prisma.contactMatchCandidate.count({ where: { tenantId } }),
      this.prisma.contactMatchCandidate.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.contactMatchCandidate.count({ where: { tenantId, status: 'MERGED' } }),
      this.prisma.contactMatchCandidate.count({ where: { tenantId, status: 'DISMISSED' } }),
      this.prisma.contactMergeHistory.count({ where: { tenantId } }),
      this.prisma.contactMergeHistory.count({ where: { tenantId, status: 'REVERTED' } }),
    ]);

    return {
      matches: { total: totalMatches, pending: pendingMatches, merged: mergedMatches, dismissed: dismissedMatches },
      merges: { total: totalMerges, reverted: revertedMerges },
    };
  }
}
