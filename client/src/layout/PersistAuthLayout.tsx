import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import useRefreshToken from '@/hooks/useRefreshToken';
import { LoadingPage } from '@/components/Loading';

const PersistAuthLayout = () => {
  const { auth } = useAuth();
  const { refresh } = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      await refresh();
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
