import { Injectable, Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.services';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schema/otp.schems';
import { User, UserSchema } from './schema/user.schema';
import { CollectionName } from 'src/common/utils/enums';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [IdentityService],
  controllers: [IdentityController],
})


export class IdentityModule {}
