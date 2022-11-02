import { Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  //hier muss der sessionService rein
  constructor() {}

  @Post()
  login() {
    return 'User login';
  }

  @Delete()
  logout() {
    return 'User logout';
  }
}
