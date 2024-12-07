import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service'; // Adjust the path
import { jwtConstant } from './constant';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: 'secret-key',
            secretOrKey: jwtConstant.secret,
        });
    }

    async validate(payload: any) {
        console.log('point 1')
        const user = await this.authService.validateUserById(payload.sub);

        if (!user) {
            console.log('in not user')
            throw new UnauthorizedException('Unauthorized token error..!!');
        }
        console.log(user)
        console.log('this jwtguard')
        return user;

        // const role = await this.authService.validateUserRole(payload.level);

        // if(role){
        //   return true;
        // }
        //  console.log(role)
        // throw new UnauthorizedException('Pleas login with Admin account');
    }
}
