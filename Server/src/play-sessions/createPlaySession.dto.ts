import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlaySessionDTO {
  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Quiz unique id',
  })
  @IsString({ message: 'Must be a string' })
  quizId: string;

  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Meet unique id',
  })
  @IsString({ message: 'Must be a string' })
  meetId: string;
}
