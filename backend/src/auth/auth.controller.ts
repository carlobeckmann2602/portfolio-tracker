import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Log in user with given credentials (email + password)' })
  @ApiResponse({ status: 201, description: 'User login was successfull' })
  @ApiResponse({ status: 400, description: 'User credentials are not in correct format' })
  @ApiResponse({ status: 403, description: 'There is no user with the given credentials; The login was unsuccessfull' })
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'The logout was successfull' })
  @ApiResponse({ status: 404, description: 'There was no active user-session which could be terminated' })
  logout(@Headers() headers) {
    return this.authService.logout(headers);
  }
}
