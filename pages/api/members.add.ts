// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '../../models/firebase_admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, email, displayName, photoURL } = req.body;
  if (uid === undefined || uid === null) {
    return res
      .status(400)
      .json({ result: false, message: 'uid가 누락되었습니다.' });
  }

  try {
    /**
     *? add()를 사용하면 document의 id와 uid가 다르기 때문에 uid를 찾기위해선 query를 하는 과정이 필요하다.
     *? doc(uid)를 이용해 document의 id를 uid로 지정하고 set()으로 document의 값을 update하는 방식으로 구현하자
     */
    const addResult = await FirebaseAdmin.getInstance()
      .Firestore.collection('members')
      .doc(uid)
      .set({
        uid,
        email: email ?? '',
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      });
    return res.status(200).json({ result: true, id: addResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false });
  }
}
