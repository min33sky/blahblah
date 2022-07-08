import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import { InAuthUser } from '@/types/in_auth_user';
import { createContext } from 'react';

interface InAuthUserContext {
  authUser: InAuthUser | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
});

/**
 * 인증 정보를 가져올 수 있는 Context
 * @param children ReactNode
 * @returns
 */
export const AuthUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};
