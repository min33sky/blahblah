import MessageModel from '@/models/message/message.model';
import { NextApiRequest, NextApiResponse } from 'next';
import BadRequestError from './errors/badRequestError';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (message === undefined) {
    throw new BadRequestError('message 누락');
  }

  await MessageModel.post({ uid, message, author });
  return res.status(201).end();
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }

  const uidTostr = Array.isArray(uid) ? uid[0] : uid;

  const messageList = await MessageModel.list({ uid: uidTostr });
  return res.status(200).json(messageList);
}

/**
 * 메시지 조회
 * @param req
 * @param res
 * @returns
 */
async function get(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId } = req.query;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadRequestError('messageId 누락');
  }

  const arrTostr = (item: any) => (Array.isArray(item) ? item[0] : item);

  const data = await MessageModel.get({
    uid: arrTostr(uid),
    messageId: arrTostr(messageId),
  });

  return res.status(200).json(data);
}

/**
 * 댓글 달기
 * @param req
 * @param res
 * @returns
 */
async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, reply } = req.body;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadRequestError('messageId 누락');
  }
  if (reply === undefined) {
    throw new BadRequestError('reply 누락');
  }

  await MessageModel.postReply({ uid, messageId, reply });
  return res.status(201).end();
}

const messageCtrl = {
  post,
  list,
  get,
  postReply,
};

export default messageCtrl;
