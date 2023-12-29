import { SocketApi, getSocket } from '@/lib/socket';
import { createContext, useContext, useEffect, useState } from 'react';

type SocketContextType = {
  socket: SocketApi | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

const SocketProvider = ({ children }: React.PropsWithChildren) => {
  const [socket, setSocket] = useState<SocketContextType['socket']>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const _socket = getSocket();

    _socket.on('connect', () => {
      setIsConnected(true);
    });
    _socket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(_socket);

    return () => {
      _socket.removeAllListeners();
      _socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) throw new Error('useSocket must be used within a SocketProvider');

  return context;
};

export default SocketProvider;
