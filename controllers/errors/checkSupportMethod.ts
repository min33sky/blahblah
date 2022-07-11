import BadRequestError from './badRequestError';

/**
 * 올바른 요청 Method인지 확인하는 함수
 * @param supportMethod API가 지원하는 Method 배열. 예) ['POST', 'GET', 'PUT', 'PATCH', 'DELETE']
 * @param method 요청한 Method
 */
export default function checkSupportMethod(
  supportMethod: string[],
  method?: string
) {
  //? 지원하지 않는 메소드일 경우 에러를 반환한다.
  if (supportMethod.indexOf(method!) === -1) {
    throw new BadRequestError('지원하지 않는 Method');
  }
}
