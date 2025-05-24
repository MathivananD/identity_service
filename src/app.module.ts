import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './identity/identity.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { IdentityGuard } from './config/identity.guard';
export const jwtConstants = {
    secret: '1234',
  };
@Module({
  imports: [
    MongooseModule.forRoot("mongodb://0.0.0.0:27017/idenity"),
     JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
      signOptions: { expiresIn: '2d' },
    }),
    IdentityModule
  ],
  controllers: [AppController],
  providers: [AppService, {
      
      provide: APP_GUARD,
      useClass: IdentityGuard,
    },],
})
export class AppModule {}
