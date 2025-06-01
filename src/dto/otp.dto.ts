import {
  IsEmail,
  isEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  Matches,
  Max,
  Min,
} from '@nestjs/class-validator';
import { OtpType } from 'src/common/utils/enums';

export class MobileOtpDto {
  @Matches(/^\d+$/, { message: 'Mobile number must contain digits only' })
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  @IsNotEmpty()
  mobileNo: string;
 

}


export class EmailOtpDto {

  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsEnum(OtpType)
  otpType: OtpType.email;
  
}


export class VerifyOtpDto {
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'PIN must be exactly 6 digits' })
  otp: string;
  @IsNotEmpty()
  otpId: string;
}
