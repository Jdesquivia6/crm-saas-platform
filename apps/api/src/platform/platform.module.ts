import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { TenantController } from './platform.controller';

@Module({
  controllers: [TenantController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
