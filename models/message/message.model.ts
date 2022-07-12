import CustomServerError from '@/controllers/errors/customServerError';
import { InMessageServer } from '@/types/in_message';
import { firestore } from 'firebase-admin';
import FirebaseAdmin from '../firebase_admin';

type MessageBodyType = {
  message: string;
  createdAt: firestore.FieldValue;
  author?: {
    displayName: string;
    photoURL?: string;
  };
};

const MEMBER_COL = 'members';
const MESSAGE_COL = 'messages';
const SCREEN_NAMES_COL = 'screen_names';
const Firestore = FirebaseAdmin.getInstance().Firestore;

/**
 * 메세지 등록
 * @param param0
 */
async function post({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  //? 메시지를 받을 사람의 정보 가져오기
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);

  //? 트랜잭션 적용
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new CustomServerError({
        statusCode: 404,
        message: '존재하지 않는 유저입니다.',
      });
    }

    /**
     *? 해당 member의 document에 messages collection을 생성하고 document를 생성한다.
     *- doc()에 인자를 주지않으면 임의의 id가 부여된 문서를 가져온다.
     */
    const newMessageRef = memberRef.collection(MESSAGE_COL).doc();

    const newMessageBody: MessageBodyType = {
      message,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    if (author) {
      newMessageBody.author = author;
    }

    //? document의 값을 업데이트한다.
    await transaction.set(newMessageRef, newMessageBody);
  });
}

/**
 * 메세지 목록 가져오기
 * @param uid 메세지를 받는 사람의 아이디
 */
async function list({ uid }: { uid: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const listData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new CustomServerError({
        statusCode: 404,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    const messageCol = memberRef.collection(MESSAGE_COL);
    const messageColDoc = await transaction.get(messageCol);
    const data = messageColDoc.docs.map((mv) => {
      const docData = mv.data() as Omit<InMessageServer, 'id'>;
      const returnData = {
        ...docData,
        id: mv.id,
        createdAt: docData.createdAt.toDate().toISOString(),
        replyAt: docData.replyAt
          ? docData.replyAt.toDate().toISOString
          : undefined,
      };
      return returnData;
    });
    return data;
  });
  return listData;
}

const MessageModel = {
  post,
  list,
};

export default MessageModel;
