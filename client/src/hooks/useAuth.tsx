import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export type AccessTokenPayload = {
  profileId: string;
  email: string;
  imageUrl: string | null;
};

export type AuthState = {
  auth: Partial<{
    accessToken: string;
  }> &
    Partial<AccessTokenPayload>;
};

export type AuthActions = {
  setAuth: (newAccessToken: string | undefined) => void;
  setInfo: (
    arg: Partial<{
      email: string;
      imageUrl: string;
    }>,
  ) => void;
};

export const useAuth = create<AuthState & AuthActions>()(set => ({
  auth: {
    accessToken: undefined,
    profileId: undefined,
    email: undefined,
    imageUrl: undefined,
  },
  setAuth: newAccessToken => {
    if (!newAccessToken) {
      return set({
        auth: {
          accessToken: undefined,
          profileId: undefined,
          email: undefined,
          imageUrl: undefined,
        },
      });
    }

    const decoded = jwtDecode<AccessTokenPayload>(newAccessToken);
    return set({
      auth: {
        accessToken: newAccessToken,
        profileId: decoded?.profileId,
        email: decoded?.email,
        imageUrl: decoded?.imageUrl,
      },
    });
  },
  setInfo: ({ email, imageUrl }) => {
    set(state => ({
      auth: {
        ...state.auth,
        email,
        imageUrl,
      },
    }));
  },
}));
