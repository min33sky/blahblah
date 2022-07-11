import CustomServerError from './customServerError';

export default class BadRequestError extends CustomServerError {
  constructor(message: string) {
    super({ statusCode: 400, message });
  }
}
