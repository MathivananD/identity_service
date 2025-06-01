import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto, UserUpdateDto } from 'src/dto/user.dto';
import { Otp } from 'src/schema/otp.schems';
import { User } from 'src/schema/user.schema';
import { LoginService } from 'src/login/login.service';
import { OtpService } from 'src/otp/otp.service';
import { errorResponse, successResponse } from 'src/config/response.helper';
import { CustomCodes } from 'src/common/utils/custom.code';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Otp.name) private otpSchema: Model<Otp>,
    @InjectModel(User.name) private userSchema: Model<User>,
    private readonly loginService: LoginService,
  ) {}

  async createUser(userDto: UserDto) {
    if (userDto.password != null) {
      userDto.password = await this.loginService.hashPassword(userDto.password);
    }
    var newObj = {
      ...userDto,
      verified: true,
    };

    return this.userSchema.create(newObj);
  }

  async getUser(res: any)  {
   

    const data = await this.userSchema.findById(res.userId).exec();
    if (!data) {
      return errorResponse("user not found",404);
    }
    return successResponse("Profile data fetched success fully",data);
  }
  async updateUser(res: any, userDto: UserUpdateDto) {
    const userExist = await this.userSchema.findById(res.userId);
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    // Update and return the updated user
   var temp= await userExist.updateOne(userDto);
    return temp;
  }
  async deleteUser(res: any) {
    try {
      const userExist = await this.userSchema.findById(res.userId).exec();
      if (!userExist) {
        return errorResponse("user not found",CustomCodes.userNotFound);
      }
    
      await userExist.updateOne({ isDeleted: true }).exec();
      return successResponse("Profile deleted succesfully");
    } catch (error) {
      return errorResponse("something went wrong",CustomCodes.failure);
    }
  }

  async updateFcmToken(res: any, fcmToken: string) {
    try {
      var updatedFile=await this.userSchema.findByIdAndUpdate(res.userId, {
        fcmToken: fcmToken,
      }).select("-password -isDeleted -isBlocked").exec()
      return successResponse("fcm updated succesfully",updatedFile);
    } catch (error) {
      throw errorResponse("user not found",CustomCodes.userNotFound);
    }
  }
}
