import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
export default class QueryParameters {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  public limit: number;

  @IsString({ message: 'CreatedAt param must be a string' })
  @IsOptional()
  public createdAt: string;

  @IsNumber({}, { message: 'Page param must be a number' })
  @Min(1, { message: 'Page param must be greater than 1' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  public page: number;
}
