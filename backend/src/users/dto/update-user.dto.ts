import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Defines shape of request body of user
//Useage for request forms from profil update page
export class UpdateUserDto {
  //Decorator class validation, returns 400 error if input is not in correct shape
  /*  
 -->to be continued,depends on profil page
 
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string; */
}
