import { firestore } from 'firebase-admin';

interface InMessageBase {
  id: string;
  message: string;
  // 댓글 정보
  reply?: string;
  author?: {
    displayName: string;
    phothURL?: string;
  };
}

export interface InMessage extends InMessageBase {
  createdAt: string;
  replyAt?: string;
}

export interface InMessageServer extends InMessageBase {
  createdAt: firestore.Timestamp;
  replyAt?: firestore.Timestamp;
}
