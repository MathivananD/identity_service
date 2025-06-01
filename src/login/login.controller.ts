import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginService } from './login.service';
import { UserDto } from 'src/dto/user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { Public } from 'src/config/public.hnadler';

@Controller('login')
export class LoginContorller {
  constructor(private readonly loginService: LoginService) {}

  
     @Post('loginWithPassword')
    loginWithPassword(@Body() loginDto: LoginDto) {
      return this.loginService.loginWithPassword(loginDto);
    }
     @Get('verifyUser')
     @Public()
    verifyUser(@Query("mobileNo") mobileNo:string) {
      return this.loginService.checkUserRegistereOrNot(mobileNo);
    }
}
