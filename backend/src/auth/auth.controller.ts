import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Log in user with given credentials (email + password)' })
  @ApiResponse({ status: 200, description: 'User login was successfull' })
  @ApiResponse({ status: 401, description: 'There is no user with the given credentials; The login was unsuccessfull' })
  login(dto: AuthDto) {
    return 'User logged in';
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'The logout was successfull' })
  @ApiResponse({ status: 400, description: 'There was no active user-session which could be terminated' })
  logout() {
    return 'User signed out';
  }
}
