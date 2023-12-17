import { SocketApi, getSocketApi } from '@/lib/api';
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
    const socketApi = getSocketApi();

    socketApi.on('connect', () => {
      setIsConnected(true);
    });

    socketApi.on('disconnect', () => {
      setIsConnected(false);
    });

    socketApi?.on('chat:broadcast:message', msg => console.log(msg));

    setSocket(socketApi);

    return () => {
      socketApi.removeAllListeners();
      socketApi.disconnect();
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
