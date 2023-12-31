import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const NoAuthLayout = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const from = location?.state?.from?.pathname || '/';
  console.log(location);

  if (auth.accessToken) {
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
};

export default NoAuthLayout;
