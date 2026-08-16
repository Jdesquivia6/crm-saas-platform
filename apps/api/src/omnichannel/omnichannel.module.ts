import { Module } from '@nestjs/common';
import { OmnichannelService } from './omnichannel.service';
import { OmnichannelController } from './omnichannel.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [OmnichannelController],
  providers: [OmnichannelService, ChatGateway],
  exports: [OmnichannelService, ChatGateway],
})
export class OmnichannelModule {}
