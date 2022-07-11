import { NextApiResponse } from 'next';
import CustomServerError from './customServerError';

/**
 * 에러 처리 핸들러
 * @param err 에러 객체
 * @param res NextApiResponse
 */
export default function handleError(err: unknown, res: NextApiResponse) {
  let unknownErr = err;

  //? CustomServerError Instance가 아닐 경우 임의의 Error Instance를 생성하자.
  if (err instanceof CustomServerError === false) {
    unknownErr = new CustomServerError({
      statusCode: 499, //? 임의로 붙인 코드 번호
      message: 'Unknown Error',
    });
  }

  // 타입 변경
  const customError = unknownErr as CustomServerError;

  res
    .status(customError.statusCode)
    .setHeader('location', customError.location ?? '')
    .send(customError.serializeErrors()); // 에러 응답에 body를 전달
}
