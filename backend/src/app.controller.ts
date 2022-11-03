import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('website')
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/')
  getWebsite() {
    return this.appService.getHello();
  }
}
