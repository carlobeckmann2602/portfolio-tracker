import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Defines shape of request body of user
//Useage for request forms from profil update page
export class UpdateUserDto {
  //Decorator class validation, returns 400 error if input is not in correct shape

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password2: string;
}
