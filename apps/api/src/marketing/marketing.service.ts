import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  // ─── SEGMENTS ───────────────────────────────────────────────

  async findAllSegments(tenantId: string, query: any = {}) {
    const { search, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [segments, total] = await Promise.all([
      this.prisma.segment.findMany({
        where,
        include: {
          rules: true,
          _count: { select: { members: true, campaigns: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.segment.count({ where }),
    ]);

    return { segments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneSegment(tenantId: string, id: string) {
    const segment = await this.prisma.segment.findFirst({
      where: { id, tenantId },
      include: {
        rules: true,
        members: {
          include: { contact: true },
          take: 50,
        },
        _count: { select: { members: true, campaigns: true } },
      },
    });

    if (!segment) throw new NotFoundException('Segment not found');
    return segment;
  }

  async createSegment(tenantId: string, data: any) {
    const { rules, ...segmentData } = data;

    const segment = await this.prisma.segment.create({
      data: {
        tenantId,
        ...segmentData,
      },
    });

    if (rules && rules.length > 0) {
      await this.prisma.segmentRule.createMany({
        data: rules.map((rule: any) => ({
          tenantId,
          segmentId: segment.id,
          ...rule,
        })),
      });
    }

    return this.findOneSegment(tenantId, segment.id);
  }

  async updateSegment(tenantId: string, id: string, data: any) {
    const segment = await this.prisma.segment.findFirst({
      where: { id, tenantId },
    });

    if (!segment) throw new NotFoundException('Segment not found');

    return this.prisma.segment.update({
      where: { id },
      data,
    });
  }

  async removeSegment(tenantId: string, id: string) {
    const segment = await this.prisma.segment.findFirst({
      where: { id, tenantId },
    });

    if (!segment) throw new NotFoundException('Segment not found');

    return this.prisma.segment.delete({ where: { id } });
  }

  async addMember(tenantId: string, segmentId: string, contactId: string) {
    const segment = await this.prisma.segment.findFirst({
      where: { id: segmentId, tenantId },
    });

    if (!segment) throw new NotFoundException('Segment not found');

    const existing = await this.prisma.segmentMember.findFirst({
      where: { segmentId, contactId },
    });

    if (existing) throw new BadRequestException('Contact already in segment');

    const member = await this.prisma.segmentMember.create({
      data: {
        tenantId,
        segmentId,
        contactId,
      },
    });

    await this.prisma.segment.update({
      where: { id: segmentId },
      data: { memberCount: { increment: 1 } },
    });

    return member;
  }

  async removeMember(tenantId: string, segmentId: string, contactId: string) {
    const member = await this.prisma.segmentMember.findFirst({
      where: { segmentId, contactId },
    });

    if (!member) throw new NotFoundException('Member not found');

    await this.prisma.segmentMember.delete({
      where: { id: member.id },
    });

    await this.prisma.segment.update({
      where: { id: segmentId },
      data: { memberCount: { decrement: 1 } },
    });

    return { success: true };
  }

  // ─── CAMPAIGNS ──────────────────────────────────────────────

  async findAllCampaigns(tenantId: string, query: any = {}) {
    const { search, status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          segment: true,
          channels: true,
          _count: { select: { recipients: true, events: true, conversions: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return { campaigns, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneCampaign(tenantId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, tenantId },
      include: {
        segment: true,
        channels: true,
        recipients: {
          include: { contact: true },
          take: 50,
        },
        events: { orderBy: { createdAt: 'desc' }, take: 50 },
        conversions: true,
        _count: { select: { recipients: true, events: true, conversions: true } },
      },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async createCampaign(tenantId: string, data: any) {
    const { channels, ...campaignData } = data;

    const campaign = await this.prisma.campaign.create({
      data: {
        tenantId,
        ...campaignData,
      },
    });

    if (channels && channels.length > 0) {
      await this.prisma.campaignChannel.createMany({
        data: channels.map((channel: string) => ({
          tenantId,
          campaignId: campaign.id,
          channel,
        })),
      });
    }

    return this.findOneCampaign(tenantId, campaign.id);
  }

  async updateCampaign(tenantId: string, id: string, data: any) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, tenantId },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');

    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }

  async startCampaign(tenantId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, tenantId },
      include: { segment: { include: { members: true } } },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'DRAFT' && campaign.status !== 'SCHEDULED') {
      throw new BadRequestException('Campaign cannot be started in current status');
    }

    const recipients = campaign.segment?.members || [];

    await this.prisma.campaign.update({
      where: { id },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
        totalRecipients: recipients.length,
        totalSent: recipients.length,
      },
    });

    if (recipients.length > 0) {
      await this.prisma.campaignRecipient.createMany({
        data: recipients.map((member: any) => ({
          tenantId,
          campaignId: id,
          contactId: member.contactId,
          status: 'SENT',
          sentAt: new Date(),
        })),
      });

      await this.prisma.campaignEvent.createMany({
        data: recipients.map((member: any) => ({
          tenantId,
          campaignId: id,
          contactId: member.contactId,
          type: 'SENT',
        })),
      });
    }

    return this.findOneCampaign(tenantId, id);
  }

  async completeCampaign(tenantId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, tenantId },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');

    return this.prisma.campaign.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  async pauseCampaign(tenantId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, tenantId },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');

    return this.prisma.campaign.update({
      where: { id },
      data: { status: 'PAUSED' },
    });
  }

  async getStats(tenantId: string) {
    const [totalCampaigns, byStatus, totalRecipients, totalConversions] = await Promise.all([
      this.prisma.campaign.count({ where: { tenantId } }),
      this.prisma.campaign.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
        _sum: { totalSent: true, totalOpened: true, totalClicked: true },
      }),
      this.prisma.campaignRecipient.count({ where: { tenantId } }),
      this.prisma.campaignConversion.count({ where: { tenantId } }),
    ]);

    return { totalCampaigns, byStatus, totalRecipients, totalConversions };
  }
}
