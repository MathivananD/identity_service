import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/dto/login.dto';
import { User } from 'src/schema/user.schema';
import { CustomTokenService } from 'src/token_service/token.service';
import * as bcrypt from 'bcrypt';
import { TokenDto } from 'src/dto/token.dto';
import { errorResponse } from 'src/config/response.helper';
import { CustomCodes } from 'src/common/utils/custom.code';
@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<User>,
    private tokenService: CustomTokenService,
  ) {}

  async loginWithPassword(loginDto: LoginDto) {
    var userExits = await this.userSchema.findOne({
      mobileNo: loginDto.mobileNo,
    });
    if (!userExits) {
      throw new NotFoundException('User name is incorrect');
    }
    var verifyPassword = await this.comparePassword(
      loginDto.password,
      userExits.password,
    );
    if (!verifyPassword) {
      throw new BadRequestException('Password is Incorrect');
    }
    var tokenModel = new TokenDto();
    tokenModel.userId = userExits.id;
    return this.tokenService.getToken(tokenModel);
  }

  async checkUserRegistereOrNot(mobileNo: string) {
    var user = await this.userSchema
      .findOne({ mobileNo: mobileNo })
      .select("-password -isDeleted -isBlocked") // only return name and email
      .exec();
    if (!user) {
      return errorResponse("User not registerd",CustomCodes.userNotFound);
    }
    if(user.isBlocked){
       return errorResponse("User blocked,Contact admin",CustomCodes.blocked);
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can use 10-12 for good security
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
