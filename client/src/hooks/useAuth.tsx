import { create } from 'zustand';

export type AuthState = {
  auth: Partial<{
    accessToken: string;
  }>;
};

export type AuthActions = {
  setAuth: (newAccessToken: string | undefined) => void;
};

export const useAuth = create<AuthState & AuthActions>()(set => ({
  auth: {
    accessToken: undefined,
  },
  setAuth: newAccessToken => {
    set({
      auth: {
        accessToken: newAccessToken,
      },
    });
  },
}));
