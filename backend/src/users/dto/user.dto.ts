import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Defines shape of request body of user
export class UserDto {
  //Decorator class validation, returns 400 error if input is not in correct shape
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
