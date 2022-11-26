import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login(authDto: AuthDto) {
    console.log(authDto);

    return 'User logged in';
  }
  logout() {
    return 'User logged out';
  }
}
