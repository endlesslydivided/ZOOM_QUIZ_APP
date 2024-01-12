import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateAnswerDTO {
  @ApiProperty({ example: 'Sun', description: 'Quiz answer text' })
  @IsString({ message: 'Must be a string' })
  @Length(1, 255, { message: 'Answer length: to 255 symbols' })
  text: string;

  @ApiProperty({ example: false, description: 'Is answer correct?' })
  @IsBoolean({ message: 'Must be a bool value' })
  isCorrect: boolean;
}
