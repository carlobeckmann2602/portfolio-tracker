import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { jwtConstants } from './constants';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(authDto: AuthDto) {
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    //Guard condition. If user not exists throw error
    if (!user) throw new ForbiddenException('No user registered with this email adress');

    //compare pw
    const pwMatches = await argon.verify(user.hash, authDto.password);

    //Guard condition. If password is not matching throw error
    if (!pwMatches) {
      throw new ForbiddenException('Password is wrong');
    }

    //Return JWT Token
    return this.signToken(user.id, user.email);
  }

  // not necessary with jwt
  // security issue! Blacklist token after logout
  // logout() {
  //   return 'User logged out';
  // }

  // function which creates a JWT Token
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    //creates token with secret, token expires after 15 min
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: jwtConstants.secret,
    });
    return {
      access_token: token,
    };
  }
}
