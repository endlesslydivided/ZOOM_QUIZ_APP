import { IsString } from 'class-validator';

export class CreateResultDTO {
  @IsString({ message: 'Must be a string' })
  answerId: string;

  @IsString({ message: 'Must be a string' })
  userId: string;

  @IsString({ message: 'Must be a string' })
  playSessionId: string;
}
