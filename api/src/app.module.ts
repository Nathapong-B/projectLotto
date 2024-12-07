import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CompanyController } from './company.controller';
import { LottoController } from './lotto.controller';
import { RewardController } from './reward.controller';
import { BalanceSheetController } from './balancesheet';
import { BannerController } from './banner.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { jwtConstant } from './constant';
// import { JwtGuardStrategy } from './jwtguard.strategy';

@Module({
  imports: [
    JwtModule.register({
    //   secret: jwtConstant.secret,
    //   signOptions: { expiresIn: '1h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, UserController, CompanyController, LottoController, RewardController, BalanceSheetController, BannerController],
  providers: [AppService, AuthService, JwtStrategy],
})
export class AppModule { }
