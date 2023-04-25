import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateAnswerDTO } from 'src/answers/dto/createAnswer.dto';

export class CreateQuizDTO {
  @IsString({ message: 'Must be a string' })
  @Length(1, 255, { message: 'Question length: to 255 symbols' })
  text: string;

  @IsArray()
  answers: CreateAnswerDTO[];
}
