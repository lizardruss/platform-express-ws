import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';

@WebSocketGateway({
  namespace: 'withoutPath',
})
export class WithoutPathSamePortGateway {
  @SubscribeMessage('push')
  onPush(client: WebSocket, data: any) {
    return {
      event: 'pop',
      data,
    };
  }
}
