import { Transform } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
export default class QueryParameters
{

    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    public limit:number;

    @IsString({message:"CreatedAt param must be a string"})
    @IsOptional()
    public createdAt:string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber({},{message:"Page param must be a number"})
    @Min(1,{message:"Page param must be greater than 1"}) 
    @IsOptional()
    public page:number;

}