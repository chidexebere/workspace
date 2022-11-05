import { createContext, useContext } from 'react';

import { useFirebaseAuth } from './hooks';

interface Props {
  children: React.ReactNode;
}

export const AuthUserContext = createContext<{
  authUser: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  deleteAuthUser: () => Promise<void>;
}>({
  authUser: null,
  isLoading: true,
  signOut: async () => undefined,
  deleteAuthUser: async () => undefined,
});

export const AuthUserProvider = ({ children }: Props) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);
