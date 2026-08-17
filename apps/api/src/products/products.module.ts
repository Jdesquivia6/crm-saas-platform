import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from './categories/categories.module';
import { TaxesModule } from './taxes/taxes.module';
import { PriceListsModule } from './price-lists/price-lists.module';
import { PrismaService } from '../core/prisma/prisma.service';

@Module({
  imports: [CategoriesModule, TaxesModule, PriceListsModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
