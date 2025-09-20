import {  IsString,  IsStrongPassword, IsEmail, Matches } from "class-validator";

export class AddUserDTO {
  @IsString()
  cognomeTitolare: string;

  @IsString()
  nomeTitolare: string;

  @IsString()
  @Matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, {
    message: 'IBAN format is invalid',
  })
  iban: string;

  @IsEmail()
  username: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}

export class UpdPsswdDTO {
  oldPassword:string;
  @IsString()
  @IsStrongPassword({
    minLength: 8,
  })
  newPassword: string;
}

export class ConfirmUserDTO {
  @IsEmail()
  username: string;
}


