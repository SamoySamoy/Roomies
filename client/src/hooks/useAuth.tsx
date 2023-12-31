import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export type TokenPayload = {
  profileId: string;
};

export type AuthState = {
  auth: Partial<{
    accessToken: string;
  }> &
    Partial<TokenPayload>;
};

export type AuthActions = {
  setAuth: (newAccessToken: string | undefined) => void;
};

export const useAuth = create<AuthState & AuthActions>()(set => ({
  auth: {
    accessToken: undefined,
    profileId: undefined,
  },
  setAuth: newAccessToken => {
    if (!newAccessToken) {
      return set({
        auth: {
          accessToken: undefined,
          profileId: undefined,
        },
      });
    }

    const decoded = jwtDecode<TokenPayload>(newAccessToken);
    return set({
      auth: {
        accessToken: newAccessToken,
        profileId: decoded?.profileId,
      },
    });
  },
}));
