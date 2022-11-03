import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Dto for transfering login data from frontend to backend
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
