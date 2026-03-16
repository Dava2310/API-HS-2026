import { Injectable } from '@nestjs/common';
import { MessageResponseDto } from './common';

@Injectable()
export class AppService {
  health(): MessageResponseDto {
    return new MessageResponseDto('Server running');
  }
}
