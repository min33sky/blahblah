import FirebaseAdmin from '@/models/firebase_admin';
import MessageModel from '@/models/message/message.model';
import { NextApiRequest, NextApiResponse } from 'next';
import BadRequestError from './errors/badRequestError';
import CustomServerError from './errors/customServerError';

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
  const { uid, page, size } = req.query;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }

  const convertPage = page === undefined ? '1' : page;
  const convertSize = size === undefined ? '10' : size;

  const uidToStr = Array.isArray(uid) ? uid[0] : uid;
  const pageToStr = Array.isArray(convertPage) ? convertPage[0] : convertPage;
  const sizeToStr = Array.isArray(convertSize) ? convertSize[0] : convertSize;

  const messageList = await MessageModel.listWithPage({
    uid: uidToStr,
    page: parseInt(pageToStr, 10),
    size: parseInt(sizeToStr, 10),
  });
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

async function updateMessage(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, deny } = req.body;
  const token = req.headers.authorization;

  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadRequestError('messageId 누락');
  }
  if (deny === undefined) {
    throw new BadRequestError('deny 누락');
  }

  if (token === undefined) {
    throw new CustomServerError({
      statusCode: 401,
      message: '권한이 없습니다. (No Token)',
    });
  }

  let tokenUid: null | string = null;

  try {
    const decode = await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
    tokenUid = decode.uid;
  } catch (error) {
    throw new BadRequestError('token에 문제가 있습니다.');
  }

  if (uid !== tokenUid) {
    throw new CustomServerError({
      statusCode: 401,
      message: '수정권한이 없습니다.',
    });
  }

  const result = await MessageModel.updateMessage({ uid, messageId, deny });
  return res.status(201).json(result);
}

const messageCtrl = {
  post,
  list,
  get,
  postReply,
  updateMessage,
};

export default messageCtrl;
