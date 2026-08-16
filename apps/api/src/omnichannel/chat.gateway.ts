import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, Set<string>>();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const userId = client.handshake.query.userId as string;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
  }

  @SubscribeMessage('join-conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    this.logger.log(`Client ${client.id} joined conversation ${data.conversationId}`);
  }

  @SubscribeMessage('leave-conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    this.logger.log(`Client ${client.id} left conversation ${data.conversationId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; isTyping: boolean },
  ) {
    this.server.to(`conversation:${data.conversationId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
      conversationId: data.conversationId,
    });
  }

  broadcastToConversation(conversationId: string, event: string, data: any) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }

  sendToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        this.server.to(socketId).emit(event, data);
      }
    }
  }

  broadcastToTenant(tenantId: string, event: string, data: any) {
    this.server.to(`tenant:${tenantId}`).emit(event, data);
  }

  joinTenantRoom(client: Socket, tenantId: string) {
    client.join(`tenant:${tenantId}`);
  }
}
