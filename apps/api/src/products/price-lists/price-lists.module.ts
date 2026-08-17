import { Module } from '@nestjs/common';
import { PriceListsController } from './price-lists.controller';
import { PriceListsService } from './price-lists.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [PriceListsController],
  providers: [PriceListsService, PrismaService],
  exports: [PriceListsService],
})
export class PriceListsModule {}
