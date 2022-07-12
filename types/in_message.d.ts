export interface InMessage {
  id: string;
  message: string;
  createdAt: string;
  // 댓글 정보
  reply?: string;
  replyAt?: string;
  author?: {
    displayName: string;
    phothURL?: string;
  };
}
