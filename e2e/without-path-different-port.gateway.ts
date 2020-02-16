import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(8080)
export class WithoutPathDifferentPortGateway {
  @SubscribeMessage('push')
  onPush(_client: any, data: any) {
    return {
      event: 'pop',
      data,
    };
  }
}
