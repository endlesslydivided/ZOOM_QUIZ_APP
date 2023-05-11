import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, Length, ValidateNested } from 'class-validator';

import { CreateAnswerDTO } from '../answers/createAnswer.dto';

export class CreateQuizDTO {
  @ApiProperty({
    example: 'What is the closest planet to the Sun?',
    description: 'Quiz question text',
  })
  @IsString({ message: 'Must be a string' })
  @Length(1, 255, { message: 'Question length: to 255 symbols' })
  text: string;

  @ApiProperty({ description: 'Quiz answers array' })
  @ValidateNested({ each: true })
  @IsArray()
  answers: CreateAnswerDTO[];
}
