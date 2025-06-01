import { Injectable, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '../schema/otp.schems';
import { User, UserSchema } from '../schema/user.schema';
import { CollectionName } from 'src/common/utils/enums';
import { OtpService } from 'src/otp/otp.service';
import { LoginService } from 'src/login/login.service';
import { OtpController } from 'src/otp/otp.controller';
import { LoginContorller } from 'src/login/login.controller';
import { CustomTokenService } from 'src/token_service/token.service';
import { UserService } from 'src/user/user.service';
import { UserContorller } from 'src/user/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [OtpService, LoginService, CustomTokenService,UserService],
  controllers: [OtpController, LoginContorller,UserContorller],
})
export class IdentityModule {}
