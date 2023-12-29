import { Badge } from '@/components/ui/badge';
import { socket } from '@/lib/socket';
import { useEffect, useState } from 'react';

const SocketIndicator = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  if (!isConnected) {
    return (
      <Badge variant='outline' className='bg-yellow-600 text-white border-none'>
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant='outline' className='bg-emerald-600 text-white border-none'>
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;
