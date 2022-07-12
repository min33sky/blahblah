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

const messageCtrl = {
  post,
  list,
};

export default messageCtrl;
