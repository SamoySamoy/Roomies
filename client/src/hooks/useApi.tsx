import { api } from '@/lib/api';
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import useRefreshToken from './useRefreshToken';

const useApi = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      config => {
        if (!config.headers['Authorization'] && auth.accessToken) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
    const responseIntercept = api.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        // 403 means old refresh token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return api;
};

export default useApi;
