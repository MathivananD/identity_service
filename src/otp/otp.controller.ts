import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailOtpDto, MobileOtpDto, VerifyOtpDto } from 'src/dto/otp.dto';
import { Public } from 'src/config/public.hnadler';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}
  @Post('sendMobileOtp')
  @Public()
  sendMobileOtp(@Body() mobileOtpDto:MobileOtpDto) {
    
    return this.otpService.sendMobileOtp(mobileOtpDto);
  }

  @Post('sendEmailOtp')
   @Public()
  sendEmailOtp(@Body() emailOtpDto:EmailOtpDto) {
    return this.otpService.sendMailOtp(emailOtpDto);
  }

  @Post('verifyOtp')
   @Public()
  verifyOtp(@Body() verifyDto:VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyDto);
  }
}
