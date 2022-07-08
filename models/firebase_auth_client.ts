import { initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
 * Client에서는 .env의 환경변수를 받을 수 없기때문에 nextjs에서 제공하는
 * 함수를 이용하여 변수를 적용. (next.config.js에 환경변수 설정)
 */
const FirebaseCredentials = {
  apiKey: publicRuntimeConfig.publicApiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
};

/**
 ** Firebase 인증에 사용할 모듈 (클라이언트용)
 */
export default class FirebaseAuthClient {
  public static instance: FirebaseAuthClient;

  private auth: Auth;

  public constructor() {
    const apps = getApps();
    if (!!apps.length === false) {
      console.log('firebase initializeApp');
      initializeApp(FirebaseCredentials);
    }
    this.auth = getAuth();
    console.log('firebase auth client constructor');
  }

  public static getInstance(): FirebaseAuthClient {
    if (!FirebaseAuthClient.instance) {
      FirebaseAuthClient.instance = new FirebaseAuthClient();
    }
    return FirebaseAuthClient.instance;
  }

  public get Auth(): Auth {
    return this.auth;
  }
}
