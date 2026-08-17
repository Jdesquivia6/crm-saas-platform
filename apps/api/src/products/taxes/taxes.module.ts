import { Module } from '@nestjs/common';
import { TaxesController } from './taxes.controller';
import { TaxesService } from './taxes.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [TaxesController],
  providers: [TaxesService, PrismaService],
  exports: [TaxesService],
})
export class TaxesModule {}
