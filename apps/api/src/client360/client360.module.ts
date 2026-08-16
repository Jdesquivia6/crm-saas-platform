import { Module } from '@nestjs/common';
import { Client360Service } from './client360.service';
import { Client360Controller } from './client360.controller';

@Module({
  controllers: [Client360Controller],
  providers: [Client360Service],
  exports: [Client360Service],
})
export class Client360Module {}
