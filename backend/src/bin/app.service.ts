import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async health() {
    return {
      statusCode: HttpStatus.OK,
      msg: 'healthy',
    };
  }
}
