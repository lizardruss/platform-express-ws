import * as WebSocket from 'ws';

export type ExpressWsSocket = WebSocket & {
  params: {
    [key: string]: string;
  };
};
