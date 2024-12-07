import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service'; // Adjust the path
import { jwtConstant } from './constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: 'secret-key',
      secretOrKey: jwtConstant.secret,
    });
  }

  async validate(payload: any) {
    // const user = await this.authService.validateUserById(payload.sub);

    // if (!user) {
    //   throw new UnauthorizedException('Unauthorized token error..!!');
    // }
    // console.log(user)
    // return user;

    const role = await this.authService.validateUserRole(payload.level);
    // console.log('point 01')
    if (role) {
      console.log(role)
      console.log('in role')
      return true;
    }
    // console.log('in error')
    throw new UnauthorizedException('Pleas login with Admin account');
  }
}
