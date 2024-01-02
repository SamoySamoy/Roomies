import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import useRefreshToken from '@/hooks/useRefreshToken';
import { LoadingPage } from '@/components/Loading';
import { useToast } from '@/components/ui/use-toast';
import { useModal } from '@/hooks/useModal';

const PersistAuthLayout = () => {
  const { auth } = useAuth();
  const { closeModal } = useModal();
  const { toast } = useToast();
  const location = useLocation();
  const { refresh } = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      const failed = (await refresh()) === undefined;
      if (failed) {
        if (location.pathname.startsWith('/invite')) {
          toast({
            description: 'You need login first to join a room by invite code',
            variant: 'warning',
          });
        }
        // Close any modal if open
        closeModal();
      }

      setIsLoading(false);
    };
    auth.accessToken ? setIsLoading(false) : verifyRefreshToken();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <Outlet />;
};

export default PersistAuthLayout;
