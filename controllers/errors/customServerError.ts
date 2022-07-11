/**
 * 에러 객체를 커스텀하기 위한 에러 클래스
 */
export default class CustomServerError extends Error {
  public statusCode: number;
  public location?: string; //? 리다이렉트가 필요할 시 사용

  constructor({
    statusCode = 500,
    message,
    location,
  }: {
    statusCode?: number;
    message: string;
    location?: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.location = location;
  }

  /**
   * 에러 내용을 반환
   */
  serializeErrors(): { message: string } | string {
    return {
      message: this.message,
    };
  }
}
