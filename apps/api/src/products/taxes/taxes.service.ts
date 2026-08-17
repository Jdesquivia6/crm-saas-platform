import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class TaxesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.tax.findMany({
      where: { tenantId },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const tax = await this.prisma.tax.findFirst({
      where: { id, tenantId },
      include: {
        products: {
          include: { product: true },
          take: 10,
        },
      },
    });

    if (!tax) throw new NotFoundException('Tax not found');
    return tax;
  }

  async create(tenantId: string, data: any) {
    return this.prisma.tax.create({
      data: { tenantId, ...data },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    const tax = await this.prisma.tax.findFirst({
      where: { id, tenantId },
    });

    if (!tax) throw new NotFoundException('Tax not found');

    return this.prisma.tax.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const tax = await this.prisma.tax.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { products: true } } },
    });

    if (!tax) throw new NotFoundException('Tax not found');
    if (tax._count.products > 0) {
      throw new BadRequestException('Cannot delete tax assigned to products');
    }

    return this.prisma.tax.delete({ where: { id } });
  }
}
