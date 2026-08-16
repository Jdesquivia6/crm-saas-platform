import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { TenantContextService } from './tenant-context.service';

@Module({
  controllers: [IamController],
  providers: [IamService, TenantContextService],
  exports: [IamService, TenantContextService],
})
export class IamModule {}
