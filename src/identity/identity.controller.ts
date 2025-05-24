import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.services';
import { OtpDto, VerifyOtpDto } from './dto/otp.dto';
import { IsOptional } from 'class-validator';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/config/public.hnadler';

@Controller('identity')
export class IdentityController {
  constructor(private identityServce: IdentityService) {}

  @Post('sendOtp')
   @Public()
  triggerOtp(@Body() loginDto: OtpDto) {
    return this.identityServce.triggerOtpService(loginDto);
  }

  @Post('verifyOtp')
  @Public()
  verifyOtp(@Body() otpDto: VerifyOtpDto) {
    return this.identityServce.verifyOtp(otpDto);
  }

  @Post('createUser')
  createUser(@Body() user: UserDto) {
    return this.identityServce.createUser(user);
  }

  @Post('verifyUser')
  verifyUser(@Body("mobileNo") mobileNo: string) {
   
    
    return this.identityServce.checkUserRegistereOrNot(mobileNo);
  }

   @Post('loginWithPassword')
  loginWithPassword(@Body() userDto: UserDto) {
    return this.identityServce.loginWithPassword(userDto);
  }
}
