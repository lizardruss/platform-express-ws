import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ExpressWsSocket } from '../src/interfaces';

@WebSocketGateway(8080, {
  path: '/:id',
})
export class WithPathDifferentPortGateway {
  @SubscribeMessage('push')
  onPush(client: ExpressWsSocket, data: any) {
    return {
      event: 'pop',
      data: {
        ...data,
        ...client.params,
      },
    };
  }
}
