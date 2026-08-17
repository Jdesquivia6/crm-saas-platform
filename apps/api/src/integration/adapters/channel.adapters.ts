import { Logger } from '@nestjs/common';

export interface ChannelAdapter {
  handleInbound(tenantId: string, payload: any): Promise<void>;
  sendOutbound(tenantId: string, config: any, payload: any): Promise<any>;
  getChannelType(): string;
}

export class InstagramAdapter implements ChannelAdapter {
  private readonly logger = new Logger(InstagramAdapter.name);

  getChannelType(): string {
    return 'INSTAGRAM';
  }

  async handleInbound(tenantId: string, payload: any): Promise<void> {
    this.logger.log(`Processing Instagram inbound for tenant ${tenantId}`);

    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length && !value?.posts?.length) return;

    if (value.messages) {
      for (const msg of value.messages) {
        this.logger.log(`Instagram message from ${msg.from}: ${msg.text?.body}`);
      }
    }
  }

  async sendOutbound(tenantId: string, config: any, payload: any): Promise<any> {
    this.logger.log(`Would send Instagram message to ${payload.to}`);
    return { status: 'queued', channel: 'INSTAGRAM' };
  }
}

export class MessengerAdapter implements ChannelAdapter {
  private readonly logger = new Logger(MessengerAdapter.name);

  getChannelType(): string {
    return 'FACEBOOK';
  }

  async handleInbound(tenantId: string, payload: any): Promise<void> {
    this.logger.log(`Processing Messenger inbound for tenant ${tenantId}`);

    const entry = payload.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (!messaging) return;

    const senderId = messaging.sender?.id;
    const message = messaging.message;

    if (message) {
      this.logger.log(`Messenger message from ${senderId}: ${message.text}`);
    }
  }

  async sendOutbound(tenantId: string, config: any, payload: any): Promise<any> {
    this.logger.log(`Would send Messenger message to ${payload.to}`);
    return { status: 'queued', channel: 'FACEBOOK' };
  }
}

export class EmailAdapter implements ChannelAdapter {
  private readonly logger = new Logger(EmailAdapter.name);

  getChannelType(): string {
    return 'EMAIL';
  }

  async handleInbound(tenantId: string, payload: any): Promise<void> {
    this.logger.log(`Processing Email inbound for tenant ${tenantId}`);

    const { from, to, subject, text, html } = payload;

    this.logger.log(`Email from ${from} to ${to}: ${subject}`);
  }

  async sendOutbound(tenantId: string, config: any, payload: any): Promise<any> {
    this.logger.log(`Would send Email to ${payload.to}: ${payload.subject}`);
    return { status: 'queued', channel: 'EMAIL' };
  }
}
