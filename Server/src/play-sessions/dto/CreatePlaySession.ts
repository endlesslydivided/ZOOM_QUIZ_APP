import {
  IsString
} from 'class-validator';

export class CreatePlaySessionDTO {
  @IsString({ message: 'Must be a string' })
  quizId: string;

  @IsString({ message: 'Must be a string' })
  meetId: string;
}
