import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from '../constants';

//class is for validating the token
//Set 'jwt' for guards. It is the default value, so only for educational reason
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }
  //Validation
  async validate(req: Request, payload: { sub: number; email: string }) {
    const token = await this.prisma.tokens.findFirst({
      where: {
        token: req.headers['authorization'],
      },
    });

    if (token != null) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, email: payload.email };
  }
}
