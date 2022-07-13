// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import checkSupportMethod from '@/controllers/errors/checkSupportMethod';
import handleError from '@/controllers/errors/handleError';
import messageCtrl from '@/controllers/message.ctrl';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supportMethod = ['GET'];

  try {
    checkSupportMethod(supportMethod, method);
    await messageCtrl.get(req, res);
  } catch (error) {
    console.error(error);
    // 에러 처리
    handleError(error, res);
  }
}
