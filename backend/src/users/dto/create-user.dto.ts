import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Defines shape of request body of user
export class CreateUserDto {
  //Decorator class validation, returns 400 error (bad request) if input is not in correct shape
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
