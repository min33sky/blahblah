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
const FirestoreRef = FirebaseAdmin.getInstance().Firestore;

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
  const memberRef = FirestoreRef.collection(MEMBER_COL).doc(uid);

  //? 트랜잭션 적용
  await FirestoreRef.runTransaction(async (transaction) => {
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

    //? 익명 등록이 아닐 경우 작성자 정보도 등록한다.
    if (author) {
      newMessageBody.author = author;
    }

    //? document의 값을 업데이트한다.
    await transaction.set(newMessageRef, newMessageBody);
  });
}

/**
 * 메세지 목록 가져오기
 * @param uid 메세지들을 받은 사람의 아이디 (해당 홈 주인)
 */
async function list({ uid }: { uid: string }) {
  const memberRef = FirestoreRef.collection(MEMBER_COL).doc(uid);
  const listData = await FirestoreRef.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new CustomServerError({
        statusCode: 404,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    const messageCol = memberRef.collection(MESSAGE_COL);
    const messageColDoc = await transaction.get(messageCol);
    const result = messageColDoc.docs.map((mv) => {
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
    return result;
  });
  return listData;
}

/**
 * 댓글 등록
 * @param uid 메세지를 받을 사람의 uid
 * @param messageId 댓글을 달 메세지의 id
 * @param reply 댓글 내용
 */
async function postReply({
  messageId,
  reply,
  uid,
}: {
  uid: string;
  messageId: string;
  reply: string;
}) {
  //? 댓글을 달 메세지와 메세지 작성자가 있는지 확인
  const memberRef = FirestoreRef.collection(MEMBER_COL).doc(uid);
  const messageRef = memberRef.collection(MESSAGE_COL).doc(messageId);

  await FirestoreRef.runTransaction(async (transaction) => {
    const memeberDoc = await transaction.get(memberRef);
    const messageDoc = await transaction.get(messageRef);

    if (memeberDoc.exists === false) {
      throw new CustomServerError({
        statusCode: 404,
        message: '존재하지 않는 사용자',
      });
    }

    if (messageDoc.exists === false) {
      throw new CustomServerError({
        statusCode: 404,
        message: '존재하지 않는 메세지',
      });
    }

    const messageData = messageDoc.data() as InMessageServer;

    //? 댓글은 하나만 달 수 있다.
    if (messageData.reply !== undefined) {
      throw new CustomServerError({
        statusCode: 400,
        message: '이미 댓글을 입력했습니다. :<',
      });
    }

    //? 댓글을 등록하기 위해 메세지 정보를 가져와 업데이트한다.
    await transaction.update(messageRef, {
      reply,
      replyAt: firestore.FieldValue.serverTimestamp(),
    });
  });
}

const MessageModel = {
  post,
  list,
  postReply,
};

export default MessageModel;
