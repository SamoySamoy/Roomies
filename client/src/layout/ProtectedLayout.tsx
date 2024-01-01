import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedLayout = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.accessToken) {
    return (
      <Navigate
        to='/login'
        replace
        state={{
          from: location,
        }}
      />
    );
  }
  return <Outlet />;
};

export default ProtectedLayout;
