import { IsDate, IsString, IsIBAN, IsStrongPassword, IsEmail } from "class-validator";
import { Type } from "class-transformer";

export class AddUserDTO {
  @IsString()
  cognomeTitolare: string;

  @IsString()
  nomeTitolare: string;

  @Type(() => Date)
  @IsDate()
  dataApertura: Date;

  @IsIBAN()
  iban: string;

  @IsEmail()
  username: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}
