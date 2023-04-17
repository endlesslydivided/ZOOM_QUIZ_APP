import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Length } from "class-validator";
import { CreateAnswerDTO } from "src/answers/dto/createAnswer.dto";

export class CreatePlaySessionDTO {

    @IsString({ message: "Must be a string" })
    quizId: string

    @IsString({ message: "Must be a string" })
    meetId: string;

}


