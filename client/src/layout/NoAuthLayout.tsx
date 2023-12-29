import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const NoAuthLayout = () => {
  const { auth } = useAuth();

  console.log('Re-render');

  if (auth.accessToken) {
    console.log('Navigate by no auth');
    return <Navigate to={'/'} replace />;
  }

  return <Outlet />;
};

export default NoAuthLayout;
