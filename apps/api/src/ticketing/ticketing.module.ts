import { Module } from '@nestjs/common';
import { TicketingService } from './ticketing.service';
import { TicketingController } from './ticketing.controller';

@Module({
  controllers: [TicketingController],
  providers: [TicketingService],
  exports: [TicketingService],
})
export class TicketingModule {}
