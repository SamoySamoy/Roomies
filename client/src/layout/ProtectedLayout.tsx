import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  const { auth } = useAuth();

  if (!auth.accessToken) {
    console.log('Navigate by protected');
    return <Navigate to='/login' replace />;
  }
  return <Outlet />;
};

export default ProtectedLayout;
