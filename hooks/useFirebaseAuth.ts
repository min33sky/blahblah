import FirebaseAuthClient from '@/models/firebase_auth_client';
import { InAuthUser } from '@/types/in_auth_user';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

/**
 * Firebase 인증 관련 정보를 제공하는 Hook
 * @returns
 */
export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   ** 구글 로그인
   */
  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(
        FirebaseAuthClient.getInstance().Auth,
        provider
      );

      /**
       *? 로그인 정보를 Storage에 저장한다.
       */
      if (signInResult.user) {
        console.info(signInResult.user);
        const res = await fetch('/api/members.add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: signInResult.user.uid,
            email: signInResult.user.email,
            displayName: signInResult.user.displayName,
            photoURL: signInResult.user.photoURL,
          }),
        });

        console.info({ status: res.status });
        const resData = await res.json();
        console.info(resData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const clear = () => {
    setLoading(true);
    setAuthUser(null);
  };

  const signOut = () =>
    FirebaseAuthClient.getInstance().Auth.signOut().then(clear);

  /**
   * 인증 감시 옵져버에서 사용할 핸들러 함수
   * @param authState
   * @returns
   */
  const authStateChanged = async (authState: User | null) => {
    if (authState === null) {
      setLoading(false);
      setAuthUser(null);
      return;
    }

    //? 서버의 인증 정보가 업데이트 되면 클라이언트의 인증 정보를 업데이트
    setLoading(true);
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName,
    });
    setLoading(false);
  };

  /**
   ** 인증 상태 감시 옵져버
   */
  useEffect(() => {
    const unsubscribe =
      FirebaseAuthClient.getInstance().Auth.onAuthStateChanged(
        authStateChanged
      );

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
}
