import { InAuthUser } from '@/types/in_auth_user';
import FirebaseAdmin from '../firebase_admin';

type AddReturnType =
  | {
      result: boolean;
      id: string;
    }
  | {
      result: boolean;
      message: string;
    };

//? Firestore Collection Name
const MEMBERS_COL = 'members';
const SCR_NAME_COL = 'screen_names';

async function add({
  uid,
  displayName,
  email,
  photoURL,
}: InAuthUser): Promise<AddReturnType> {
  try {
    /**
     *! Deprecated
     *? add()를 사용하면 document의 id와 uid가 다르기 때문에 uid를 찾기위해선 query를 하는 과정이 필요하다.
     *? doc(uid)를 이용해 document의 id를 uid로 지정하고 set()으로 document의 값을 update하는 방식으로 구현하자
     */
    // const addResult = await FirebaseAdmin.getInstance()
    //   .Firestore.collection('members')
    //   .doc(uid)
    //   .set({
    //     uid,
    //     email: email ?? '',
    //     displayName: displayName ?? '',
    //     photoURL: photoURL ?? '',
    //   });

    /**
     *? Transaction 적용
     *? 회원 정보를 UID를 키로 사용해서 저장하는데 ('members) URL에 uid대신 알아볼 수 있는 값을 사용하기 위해
     *? 'screen_names' 콜렉션에 email을 키값으로 사용하여 데이터를 저장한다.
     *? 2가지 DB작업을 하기 때문에 무결점을 지키기 위해서 트랜잭션을 적용하였다.
     */
    const screenName = (email as string).replace('@gmail.com', ''); //? 이메일 앞부분을 키로 사용
    const addResult =
      await FirebaseAdmin.getInstance().Firestore.runTransaction(
        async (transaction) => {
          const memberRef = FirebaseAdmin.getInstance()
            .Firestore.collection(MEMBERS_COL)
            .doc(uid);
          const screenNameRef = FirebaseAdmin.getInstance()
            .Firestore.collection(SCR_NAME_COL)
            .doc(screenName);

          const memberDoc = await transaction.get(memberRef);
          //? 기존 유저 데이터가 존재할 시 종료
          if (memberDoc.exists) {
            return false;
          }

          const addData = {
            uid,
            email,
            displayName: displayName ?? '',
            photoURL: photoURL ?? '',
          };

          await transaction.set(memberRef, addData);
          await transaction.set(screenNameRef, addData);
          return true;
        }
      );

    return { result: true, id: uid };
  } catch (error) {
    console.error(error);
    return { result: false, message: '서버에러' };
  }
}

/**
 * screenName으로 회원 데이터 가져오기
 * @param screenName
 * @returns
 */
async function findByScreenName(
  screenName: string
): Promise<InAuthUser | null> {
  /**
   *? 'screen_names' collection에서 인자로 받은 document가 존재하는 지 확인 후 리턴한다.
   */

  const memberRef = FirebaseAdmin.getInstance()
    .Firestore.collection(SCR_NAME_COL)
    .doc(screenName);

  const memberDoc = await memberRef.get();

  if (memberDoc.exists === false) {
    return null;
  }

  const data = memberDoc.data() as InAuthUser;

  return data;
}

const MemberModel = {
  add,
  findByScreenName,
};

export default MemberModel;
