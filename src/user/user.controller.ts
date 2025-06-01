import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserUpdateDto } from 'src/dto/user.dto';
import { Public } from 'src/config/public.hnadler';

@Controller('profile')
export class UserContorller {
  constructor(private readonly userService: UserService) {}
  @Post('signUp')
  @Public()
  createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }
  @Get()
  getUser(@Req() req: Request) {
    return this.userService.getUser(req);
  }
  @Put()
  updateUser(@Req() req: Request,@Body() userDto:UserUpdateDto) {
    return this.userService.updateUser(req,userDto);
  }

  @Post('updateFcmToken')
  updateFcmToken(@Req() req: Request,@Body("fcmToken") fcmToken:string) {
    return this.userService.updateFcmToken(req,fcmToken);
  }
l̥
  @Delete()
  deleteUser(@Req() req:Request) {
    
    return this.userService.deleteUser(req);
  }
}
