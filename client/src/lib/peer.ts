import Peer, { PeerOptions } from 'peerjs';
import { SERVER_PORT_DEV, SERVER_PORT_LOCAL, SERVER_URL } from './constants';

export const createNewPeer = (peerId: string) => {
  const options: PeerOptions = {
    host: SERVER_URL,
    path: '/',
    port: process.env.NODE_ENV === 'development' ? SERVER_PORT_DEV + 1 : SERVER_PORT_LOCAL + 1,
  };
  return new Peer(peerId, options);
};
