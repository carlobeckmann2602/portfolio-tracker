import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { jwtConstants } from './constants';
import { response } from 'express';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(authDto: AuthDto) {
    const lowerCaseEmail = authDto.email.toLowerCase();
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
    });

    //Guard condition. If user not exists throw error
    if (!user) throw new ForbiddenException('Wrong credentials');

    //compare pw
    const pwMatches = await argon.verify(user.hash, authDto.password);

    //Guard condition. If password is not matching throw error
    if (!pwMatches) {
      throw new ForbiddenException('Wrong credentials');
    }

    //Return JWT Token
    return this.signToken(user.id, user.email);
  }

  //logout 
  async logout(headers: Headers) {
    if (headers['authorization'] == undefined) {
      return response.status(404);
    } else {
      await this.prisma.tokens.create({
        data: {
          token: headers['authorization'],
        },
      });
      return response.status(200);
    }
  }

  // function which creates a JWT Token
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    //creates token with secret, token expires after 30 days
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: jwtConstants.secret,
    });
    return {
      access_token: token,
    };
  }
}
