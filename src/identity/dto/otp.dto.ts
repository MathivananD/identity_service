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

export class OtpDto {
  @Matches(/^\d+$/, { message: 'Mobile number must contain digits only' })
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  @IsOptional()
  mobileNo: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsNotEmpty()
  @IsEnum(OtpType)
  otpType: OtpType;
}


export class VerifyOtpDto {
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'PIN must be exactly 6 digits' })
  otp: string;
  @IsNotEmpty()
  otpId: string;
  @IsEnum(OtpType)
  otpType: OtpType;
}
