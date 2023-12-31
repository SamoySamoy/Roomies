import { useEffect } from 'react';

import { useAuth } from './useAuth';
import useRefreshToken from './useRefreshToken';
import { api } from '@/lib/api';

const useApi = () => {
  const { auth } = useAuth();
  const { refresh } = useRefreshToken();

  useEffect(() => {
    const reqIntercept = api.interceptors.request.use(
      config => {
        if (!config.headers['Authorization'] && auth.accessToken) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
    const resIntercept = api.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        // 403 means old refresh token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          if (newAccessToken) {
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(prevRequest);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(reqIntercept);
      api.interceptors.response.eject(resIntercept);
    };
  }, [auth, refresh]);

  return api;
};

export default useApi;
