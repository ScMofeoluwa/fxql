import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { FxqlErrorDto } from '../dto/fxql-error.dto';

@Catch(Error)
export class FxqlExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorResponse = new FxqlErrorDto({
      message: exception.message || 'An unexpected error occurred',
      code: 'FXQL-400',
    });

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
