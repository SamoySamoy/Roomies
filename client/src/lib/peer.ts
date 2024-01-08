import Peer from 'peerjs';

export const createNewPeer = (peerId: string) => {
  // const options: PeerOptions = {
  //   host: PEER_SERVER_URL,
  //   path: '/',
  //   port: PEER_SERVER_PORT,
  // };
  // return new Peer(peerId, options);
  return new Peer(peerId);
};
