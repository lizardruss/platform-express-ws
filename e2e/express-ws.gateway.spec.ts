import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import * as WebSocket from 'ws';

import { ExpressWsAdapter } from './../src';
import { WithPathDifferentPortGateway } from './with-path-different-port.gateway';
import { WithPathSamePortGateway } from './with-path-same-port.gateway';
import { WithoutPathDifferentPortGateway } from './without-path-different-port.gateway';
import { WithoutPathSamePortGateway } from './without-path-same-port.gateway';

async function createNestApp(...gateways: any[]): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = await testingModule.createNestApplication();
  app.useWebSocketAdapter(new ExpressWsAdapter(app) as any);
  return app;
}

describe('WebSocketGateway (ExpressWsAdapter)', () => {
  let app: INestApplication;

  afterEach(async () => await app.close());

  it(`should handle message (with path, same port)`, async () => {
    app = await createNestApp(WithPathSamePortGateway);
    await app.listenAsync(3000);

    const ws = new WebSocket('ws://localhost:3000/1234');
    await new Promise(resolve => ws.on('open', resolve));
    await new Promise(resolve => {
      ws.on('message', (data: any) => {
        expect(JSON.parse(data)).to.deep.eq({
          event: 'pop',
          data: { test: 'test', id: '1234' },
        });
        resolve();
      });
      ws.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it(`should handle message (with path, different port)`, async () => {
    app = await createNestApp(WithPathDifferentPortGateway);
    await app.listenAsync(3000);

    const ws = new WebSocket('ws://localhost:8080/1234');
    await new Promise(resolve => ws.on('open', resolve));
    await new Promise(resolve => {
      ws.on('message', (data: any) => {
        expect(JSON.parse(data)).to.deep.eq({
          event: 'pop',
          data: { test: 'test', id: '1234' },
        });
        resolve();
      });
      ws.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it(`should handle message (without path, same port)`, async () => {
    app = await createNestApp(WithoutPathSamePortGateway);
    await app.listenAsync(3000);

    const ws = new WebSocket('ws://localhost:3000');
    await new Promise(resolve => ws.on('open', resolve));
    await new Promise(resolve => {
      ws.on('message', (data: any) => {
        expect(JSON.parse(data)).to.deep.eq({
          event: 'pop',
          data: { test: 'test' },
        });
        resolve();
      });
      ws.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it(`should handle message (without path, different port)`, async () => {
    app = await createNestApp(WithoutPathDifferentPortGateway);
    await app.listenAsync(3000);

    const ws = new WebSocket('ws://localhost:8080');
    await new Promise(resolve => ws.on('open', resolve));
    await new Promise(resolve => {
      ws.on('message', (data: any) => {
        expect(JSON.parse(data)).to.deep.eq({
          event: 'pop',
          data: { test: 'test' },
        });
        resolve();
      });
      ws.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it(`should not crash on unknown message`, async () => {
    app = await createNestApp(WithoutPathDifferentPortGateway);
    await app.listenAsync(3000);

    const ws = new WebSocket('ws://localhost:8080');
    await new Promise(resolve => ws.on('open', resolve));
    ws.send(
      JSON.stringify({
        event: 'foo',
        data: {
          test: 'test',
        },
      }),
    );
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it(`should support many gateways (different ports)`, async function() {
    app = await createNestApp(
      WithPathSamePortGateway,
      WithPathDifferentPortGateway,
    );
    await app.listenAsync(3000);

    const ws1 = new WebSocket('ws://localhost:3000/1234');
    await new Promise(resolve => ws1.on('open', resolve));
    await new Promise(resolve => {
      ws1.on('message', (data: any) => {
        expect(JSON.parse(data).data.test).to.be.eql('test');
        resolve();
      });
      ws1.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });

    const ws2 = new WebSocket('ws://localhost:8080/5678');
    await new Promise(resolve => ws2.on('open', resolve));
    await new Promise(resolve => {
      ws2.on('message', (data: any) => {
        expect(JSON.parse(data).data.test).to.be.eql('test');
        resolve();
      });
      ws2.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });

  it(`should support many gateways (different namespaces, different paths)`, async function() {
    app = await createNestApp(
      WithoutPathSamePortGateway,
      WithPathSamePortGateway,
    );
    await app.listenAsync(3000);

    const ws1 = new WebSocket('ws://localhost:3000');
    await new Promise(resolve => ws1.on('open', resolve));
    await new Promise(resolve => {
      ws1.on('message', (data: any) => {
        expect(JSON.parse(data)).to.deep.eq({
          event: 'pop',
          data: { test: 'test' },
        });
        resolve();
      });
      ws1.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });

    const ws2 = new WebSocket('ws://localhost:3000/5678');
    await new Promise(resolve => ws2.on('open', resolve));
    await new Promise(resolve => {
      ws2.on('message', (data: any) => {
        expect(JSON.parse(data)).to.deep.eq({
          event: 'pop',
          data: { test: 'test', id: '5678' },
        });
        resolve();
      });
      ws2.send(
        JSON.stringify({
          event: 'push',
          data: {
            test: 'test',
          },
        }),
      );
    });
  });
});
