import { api } from '@/lib/api';
import { useAuth } from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    let result: string | undefined = undefined;
    try {
      const res = await api.get<{ accessToken: string }>('/auth/refresh');
      result = res.data.accessToken;
    } catch (err) {
      console.log(err);
      result = undefined;
    }
    console.log(result);
    setAuth(result);
    return result;
  };
  return { refresh };
};

export default useRefreshToken;
