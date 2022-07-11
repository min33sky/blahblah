// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MemberModel from '@/models/member/member.model';
import type { NextApiRequest, NextApiResponse } from 'next';
import BadRequestError from './errors/badRequestError';
import CustomServerError from './errors/customServerError';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;
  if (uid === undefined || uid === null) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }
  if (email === undefined || email === null) {
    throw new BadRequestError('email이 누락되었습니다.');
  }

  const addResult = await MemberModel.add({
    uid,
    displayName,
    email,
    photoURL,
  });

  if (addResult.result === true) {
    return res.status(200).json(addResult);
  }
  return res.status(500).json(addResult);
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;

  if (screenName === undefined || screenName === null) {
    throw new BadRequestError('screenName이 누락되었습니다.');
  }

  const extractScreenName = Array.isArray(screenName)
    ? screenName[0]
    : screenName;
  const findResult = await MemberModel.findByScreenName(extractScreenName);

  if (!findResult) {
    // return res.status(404).end();
    throw new CustomServerError({
      statusCode: 404,
      message: '해당 이름이 존재하지 않아요.',
    });
  }
  res.status(200).json(findResult);
}

const MemberCtrl = {
  add,
  findByScreenName,
};

export default MemberCtrl;
