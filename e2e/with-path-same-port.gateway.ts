import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ExpressWsSocket } from '../src/interfaces';

@WebSocketGateway({
  namespace: 'withPath',
  path: '/:id',
})
export class WithPathSamePortGateway {
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
