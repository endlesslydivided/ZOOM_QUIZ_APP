import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateAnswerDTO {
  @IsString({ message: 'Must be a string' })
  @Length(1, 255, { message: 'Answer length: to 255 symbols' })
  text: string;

  @IsBoolean({ message: 'Must be a bool value' })
  isCorrect: boolean;
}
