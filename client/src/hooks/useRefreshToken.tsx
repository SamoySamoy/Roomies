import { api } from '@/lib/api';
import { useAuth } from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await api.get<{ accessToken: string }>('/refresh', {
      withCredentials: true,
    });
    console.log(response.data.accessToken);
    // return { ...prev, accessToken: response.data.accessToken };
    // setAuth();
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
