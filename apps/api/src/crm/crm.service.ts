import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import {
  CreateContactDto,
  UpdateContactDto,
  CreateContactNoteDto,
} from './dto/contact.dto';
import {
  CreateTagDto,
  UpdateTagDto,
} from './dto/tag.dto';
import {
  CreateContactIdentifierDto,
  CreateContactAddressDto,
  AssignContactDto,
  LinkCompanyDto,
  SearchContactsDto,
} from './dto/contact-extra.dto';

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── COMPANIES ──────────────────────────────────────

  async createCompany(tenantId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: { tenantId, ...dto },
    });
  }

  async findCompanies(tenantId: string, params?: { skip?: number; take?: number; q?: string }) {
    const where: Prisma.CompanyWhereInput = { tenantId, deletedAt: null };

    if (params?.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { tradeName: { contains: params.q, mode: 'insensitive' } },
        { email: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.company.findMany({
      where,
      skip: params?.skip || 0,
      take: params?.take || 50,
      include: {
        _count: { select: { contactCompanyRelations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCompanyById(tenantId: string, id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        contactCompanyRelations: {
          include: {
            contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });
    if (!company) throw new NotFoundException(`Empresa ${id} no encontrada`);
    return company;
  }

  async updateCompany(tenantId: string, id: string, dto: UpdateCompanyDto) {
    await this.findCompanyById(tenantId, id);
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  async softDeleteCompany(tenantId: string, id: string) {
    await this.findCompanyById(tenantId, id);
    await this.prisma.company.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── CONTACTS ───────────────────────────────────────

  async createContact(tenantId: string, dto: CreateContactDto) {
    const { tags, ...data } = dto;
    const contact = await this.prisma.contact.create({
      data: { tenantId, ...data },
    });

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await this.prisma.tag.upsert({
          where: { tenantId_name: { tenantId, name: tagName } },
          update: {},
          create: { tenantId, name: tagName },
        });
        await this.prisma.contactTag.create({
          data: { contactId: contact.id, tagId: tag.id },
        });
      }
    }

    return this.findContactById(tenantId, contact.id);
  }

  async findContacts(tenantId: string, params: SearchContactsDto) {
    const where: Prisma.ContactWhereInput = { tenantId, deletedAt: null };

    if (params.q) {
      where.OR = [
        { firstName: { contains: params.q, mode: 'insensitive' } },
        { lastName: { contains: params.q, mode: 'insensitive' } },
        { email: { contains: params.q, mode: 'insensitive' } },
        { phone: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    if (params.status) where.status = params.status;
    if (params.ownerUserId) where.ownerUserId = params.ownerUserId;

    if (params.tag) {
      where.contactTags = {
        some: { tag: { name: params.tag, tenantId } },
      };
    }

    return this.prisma.contact.findMany({
      where,
      skip: parseInt(params.skip || '0', 10),
      take: parseInt(params.take || '50', 10),
      include: {
        contactTags: { include: { tag: true } },
        contactCompanyRelations: {
          include: { company: { select: { id: true, name: true } } },
        },
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findContactById(tenantId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        contactTags: { include: { tag: true } },
        contactCompanyRelations: {
          include: { company: { select: { id: true, name: true, tradeName: true } } },
        },
        identifiers: true,
        addresses: true,
        notes: { orderBy: { createdAt: 'desc' }, take: 10 },
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
      },
    });
    if (!contact) throw new NotFoundException(`Contacto ${id} no encontrado`);
    return contact;
  }

  async updateContact(tenantId: string, id: string, dto: UpdateContactDto) {
    await this.findContactById(tenantId, id);
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  async softDeleteContact(tenantId: string, id: string) {
    await this.findContactById(tenantId, id);
    await this.prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── CONTACT IDENTIFIERS ────────────────────────────

  async addIdentifier(tenantId: string, contactId: string, dto: CreateContactIdentifierDto) {
    await this.findContactById(tenantId, contactId);
    const normalizedValue = dto.value.toLowerCase().trim();

    return this.prisma.contactIdentifier.create({
      data: {
        tenantId,
        contactId,
        identifierType: dto.identifierType,
        value: dto.value,
        normalizedValue,
        isPrimary: dto.isPrimary || false,
      },
    });
  }

  async removeIdentifier(id: string) {
    return this.prisma.contactIdentifier.delete({ where: { id } });
  }

  // ─── CONTACT ADDRESSES ──────────────────────────────

  async addAddress(tenantId: string, contactId: string, dto: CreateContactAddressDto) {
    await this.findContactById(tenantId, contactId);

    return this.prisma.contactAddress.create({
      data: {
        tenantId,
        contactId,
        addressType: dto.addressType,
        street: dto.street,
        city: dto.city,
        countryCode: dto.countryCode,
        isPrimary: dto.isPrimary || false,
      },
    });
  }

  async removeAddress(id: string) {
    return this.prisma.contactAddress.delete({ where: { id } });
  }

  // ─── TAGS ───────────────────────────────────────────

  async createTag(tenantId: string, dto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({
      where: { tenantId_name: { tenantId, name: dto.name } },
    });
    if (existing) throw new ConflictException(`Tag '${dto.name}' ya existe`);

    return this.prisma.tag.create({ data: { tenantId, ...dto } });
  }

  async findTags(tenantId: string) {
    return this.prisma.tag.findMany({
      where: { tenantId },
      include: { _count: { select: { contactTags: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async updateTag(tenantId: string, id: string, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.findFirst({ where: { id, tenantId } });
    if (!tag) throw new NotFoundException(`Tag ${id} no encontrado`);
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async deleteTag(tenantId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({ where: { id, tenantId } });
    if (!tag) throw new NotFoundException(`Tag ${id} no encontrado`);
    return this.prisma.tag.delete({ where: { id } });
  }

  // ─── CONTACT TAGS ───────────────────────────────────

  async addTagToContact(tenantId: string, contactId: string, tagName: string) {
    await this.findContactById(tenantId, contactId);

    const tag = await this.prisma.tag.upsert({
      where: { tenantId_name: { tenantId, name: tagName } },
      update: {},
      create: { tenantId, name: tagName },
    });

    const existing = await this.prisma.contactTag.findUnique({
      where: { contactId_tagId: { contactId, tagId: tag.id } },
    });
    if (existing) throw new ConflictException('Tag ya asignado al contacto');

    return this.prisma.contactTag.create({ data: { contactId, tagId: tag.id } });
  }

  async removeTagFromContact(contactId: string, tagId: string) {
    return this.prisma.contactTag.delete({
      where: { contactId_tagId: { contactId, tagId } },
    });
  }

  // ─── CONTACT NOTES ──────────────────────────────────

  async addNote(tenantId: string, contactId: string, userId: string | undefined, dto: CreateContactNoteDto) {
    await this.findContactById(tenantId, contactId);

    return this.prisma.contactNote.create({
      data: {
        tenantId,
        contactId,
        userId: userId || null,
        content: dto.content,
        isPinned: dto.isPinned || false,
      },
    });
  }

  async findNotes(tenantId: string, contactId: string) {
    await this.findContactById(tenantId, contactId);
    return this.prisma.contactNote.findMany({
      where: { contactId, tenantId },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async updateNote(tenantId: string, noteId: string, dto: Partial<CreateContactNoteDto>) {
    const note = await this.prisma.contactNote.findFirst({
      where: { id: noteId, tenantId },
    });
    if (!note) throw new NotFoundException(`Nota ${noteId} no encontrada`);

    return this.prisma.contactNote.update({
      where: { id: noteId },
      data: { content: dto.content, isPinned: dto.isPinned },
    });
  }

  async deleteNote(tenantId: string, noteId: string) {
    const note = await this.prisma.contactNote.findFirst({
      where: { id: noteId, tenantId },
    });
    if (!note) throw new NotFoundException(`Nota ${noteId} no encontrada`);
    return this.prisma.contactNote.delete({ where: { id: noteId } });
  }

  // ─── CONTACT ASSIGNMENTS ────────────────────────────

  async assignContact(tenantId: string, contactId: string, dto: AssignContactDto) {
    await this.findContactById(tenantId, contactId);

    const existing = await this.prisma.contactAssignment.findUnique({
      where: { contactId_userId: { contactId, userId: dto.userId } },
    });
    if (existing) throw new ConflictException('Usuario ya asignado a este contacto');

    return this.prisma.contactAssignment.create({
      data: {
        tenantId,
        contactId,
        userId: dto.userId,
        isPrimary: dto.isPrimary || false,
      },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  async removeAssignment(contactId: string, userId: string) {
    return this.prisma.contactAssignment.delete({
      where: { contactId_userId: { contactId, userId } },
    });
  }

  // ─── COMPANY RELATIONS ──────────────────────────────

  async linkCompany(tenantId: string, contactId: string, dto: LinkCompanyDto) {
    await this.findContactById(tenantId, contactId);

    const company = await this.prisma.company.findFirst({
      where: { id: dto.companyId, tenantId, deletedAt: null },
    });
    if (!company) throw new NotFoundException(`Empresa ${dto.companyId} no encontrada`);

    const existing = await this.prisma.contactCompanyRelation.findUnique({
      where: { contactId_companyId: { contactId, companyId: dto.companyId } },
    });
    if (existing) throw new ConflictException('Contacto ya vinculado a esta empresa');

    return this.prisma.contactCompanyRelation.create({
      data: {
        tenantId,
        contactId,
        companyId: dto.companyId,
        role: dto.role,
        isPrimary: dto.isPrimary || false,
      },
      include: { company: { select: { id: true, name: true } } },
    });
  }

  async unlinkCompany(contactId: string, companyId: string) {
    return this.prisma.contactCompanyRelation.delete({
      where: { contactId_companyId: { contactId, companyId } },
    });
  }

  // ─── STATS ──────────────────────────────────────────

  async getContactStats(tenantId: string) {
    const [total, byStatus, byLeadSource] = await Promise.all([
      this.prisma.contact.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.contact.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: true,
      }),
      this.prisma.contact.groupBy({
        by: ['leadSource'],
        where: { tenantId, deletedAt: null, leadSource: { not: null } },
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      byLeadSource: byLeadSource.map((s) => ({ source: s.leadSource, count: s._count })),
    };
  }
}
