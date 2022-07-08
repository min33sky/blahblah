import * as admin from 'firebase-admin';

interface Config {
  databaseurl: string;
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
}

//? Firebase-Admin SDK
export default class FirebaseAdmin {
  public static instance: FirebaseAdmin;
  private init = false;

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      //? 인스턴스를 생성하고 환경 설정 초기화
      FirebaseAdmin.instance = new FirebaseAdmin();
      FirebaseAdmin.instance.bootstrap();
    }
    return FirebaseAdmin.instance;
  }

  /**
   * Get Firestore
   */
  public get Firestore(): FirebaseFirestore.Firestore {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.firestore();
  }

  /**
   * Get Auth
   */
  public get Auth(): admin.auth.Auth {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.auth();
  }

  private bootstrap(): void {
    if (!!admin.apps.length === true) {
      this.init = true;
      return;
    }

    const config: Config = {
      databaseurl: process.env.databaseurl || '',
      credential: {
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'), //? 실제로 개행이 되도록 개행문자로 변경
        clientEmail: process.env.clientEmail || '',
        projectId: process.env.projectId || '',
      },
    };

    admin.initializeApp({
      databaseURL: config.databaseurl,
      credential: admin.credential.cert(config.credential),
    });

    console.log('Bootstrap End');
  }
}
