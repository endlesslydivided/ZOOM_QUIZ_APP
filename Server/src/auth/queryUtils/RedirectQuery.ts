import { IsString, Length } from 'class-validator';

const codeMin = 32;
const codeMax = 64;

export class RedirectQuery {
  @IsString({ message: 'Code must be a string' })
  @Length(codeMin, codeMax, {
    message: `Code length must be from ${codeMin} to ${codeMax}`,
  })
  public code: string;

  @IsString({ message: 'State must be a string' })
  public state: string;
}
