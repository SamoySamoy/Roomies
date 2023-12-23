import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const NoAuthLayout = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);

  console.log('Re-render');

  if (auth.accessToken) {
    console.log('Navigate by no auth');
    return <Navigate to={'/explore'} replace />;
  }

  // useEffect(() => {
  //   if (auth.accessToken) {
  //     console.log('Navigate by no auth');
  //     navigate('/', {
  //       replace: true,
  //     });
  //   }
  //   setIsLoadingLayout(false);
  // }, [auth.accessToken]);
  // if (isLoadingLayout) {
  //   return null;
  // }
  return <Outlet />;
};

export default NoAuthLayout;
