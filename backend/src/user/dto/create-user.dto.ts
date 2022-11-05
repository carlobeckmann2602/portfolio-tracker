import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Defines shape of request body of user
//Useage for requests from registration form
export class CreateUserDto {
  //Decorator class validation, returns 400 error (bad request) if input is not in correct shape
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  //weitere Felder aus Registration form
  //.... abhaengig von Design/Marketing
}
