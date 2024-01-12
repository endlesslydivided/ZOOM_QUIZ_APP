import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateResultDTO {
  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Result answer id',
  })
  @IsString({ message: 'Must be a string' })
  answerId: string;

  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Result user id',
  })
  @IsString({ message: 'Must be a string' })
  userId: string;

  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Result play session id',
  })
  @IsString({ message: 'Must be a string' })
  playSessionId: string;
}
