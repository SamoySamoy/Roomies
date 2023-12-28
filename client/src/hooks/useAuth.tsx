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
    let decoded: TokenPayload | undefined;
    if (newAccessToken) {
      decoded = jwtDecode<TokenPayload>(newAccessToken);
    }
    set({
      auth: {
        accessToken: newAccessToken,
        profileId: decoded?.profileId,
      },
    });
  },
}));
