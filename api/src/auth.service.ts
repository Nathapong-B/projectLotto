import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstant } from './constant';

@Injectable()
export class AuthService {
  static login(usr: { user: string; pwd: string; }) {
    throw new Error("Method not implemented.");
  }
  constructor(private readonly jwtService: JwtService) { }

  async validateUserById(userId: string) {
    return true;
    //  return null;
  }

  async validateUserRole(userRole: string) {
    if (userRole === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, user_name: user.user, level: user.level };
    return {
      access_token: this.jwtService.sign(payload, { secret: jwtConstant.secret, expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { secret: jwtConstant.refresh, expiresIn: '24h' }),
    };
  }

  async verifyToken(token: string) {
    const payload = this.jwtService.verifyAsync(token, { secret: jwtConstant.secret });
    return payload;
  };
}
