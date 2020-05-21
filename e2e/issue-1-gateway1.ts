import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import WebSocket = require('ws');

import { ExpressWsSocket } from '../src';

@WebSocketGateway({
  path: '/events/:token/:agent/:types',
  serveClient: false,
  namespace: '/',
})
export class Issue1Gateway1
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  wss!: WebSocket.Server;

  private logger: Logger = new Logger('WsGateway');

  afterInit(server: WebSocket.Server) {
    this.logger.log('WE init server');
  }

  handleConnection(client: ExpressWsSocket, ...args: any[]) {
    this.logger.log(`handleConnection url: ${client.url}`);
    this.logger.log(`handleConnection extensions: ${client.extensions}`);
  }

  handleDisconnect(client: ExpressWsSocket) {
    this.logger.log(`handleDisconnect`);
  }

  @SubscribeMessage('events')
  onPush(client: ExpressWsSocket, data: any) {
    this.logger.log(' GET events');
    return {
      event: 'pop',
      data: {
        ...data,
        ...client.params,
      },
    };
  }
}
