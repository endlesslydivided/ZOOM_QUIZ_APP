import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages: string;
  entityErrors: Record<string, string[]>;

  constructor(message: string, entityErrors: Record<string, string[]>) {
    super(message, HttpStatus.BAD_REQUEST);
    this.messages = message;
    this.entityErrors = entityErrors;
  }
}
