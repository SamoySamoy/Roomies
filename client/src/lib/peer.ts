import Peer from 'peerjs';

export const createNewPeer = (peerId: string) => {
  /* const options: PeerOptions = {
    host: SERVER_URL,
    path: '/',
    port: process.env.NODE_ENV === 'development' ? SERVER_PORT_DEV + 1 : SERVER_PORT_LOCAL + 1,
  };
  return new Peer(peerId, options); */
  return new Peer(peerId);
};
