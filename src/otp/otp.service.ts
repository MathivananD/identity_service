import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpType } from 'src/common/utils/enums';
import { TokenDto } from 'src/dto/token.dto';
import {
  EmailOtpDto,
  MobileOtpDto,
  VerifyOtpDto,
} from 'src/dto/otp.dto';
import { Otp, OtpSchema } from 'src/schema/otp.schems';
import { User } from 'src/schema/user.schema';
import { CustomTokenService } from 'src/token_service/token.service';
import { errorResponse } from 'src/config/response.helper';
import { CustomCodes } from 'src/common/utils/custom.code';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpSchema: Model<Otp>,
    @InjectModel(User.name) private userSchema: Model<User>,
    private tokenService: CustomTokenService,
    
  ) {}
l̥
  async sendMailOtp(otpDto: EmailOtpDto) {
    const userExist = await this.userSchema.findOne({ email: otpDto.email ,isDeleted:false });
    if (!userExist||userExist.isDeleted) {
      throw new NotFoundException('User not found,Try to register before login');
    }
   if(userExist.isBlocked){
    return errorResponse("user blocked",CustomCodes.blocked);
   }
    var otp = this.generateOTP();
    var otpModel = new Otp();
    otpModel.email = otpDto.email;
    otpModel.expiredAt = otp.expiredAt;
    otpModel.otp = otp.otp;
    return otpModel;
  }

  async sendMobileOtp(otpDto: MobileOtpDto) {
    
    
    const userExist = await this.userSchema.findOne({
      mobileNo: otpDto.mobileNo,
    });

    if (!userExist) {
      throw new NotFoundException('User not foun,Try to register before login');
    }

    var otp = this.generateOTP();
    var otpModel = new Otp();
    otpModel.mobileNo = otpDto.mobileNo;
    otpModel.expiredAt = otp.expiredAt;
    otpModel.otp = otp.otp;
    otpModel.otpType=OtpType.mobileNo;
    return this.otpSchema.create(otpModel);
  }

  sendWhatsAppOtp(otpDto: MobileOtpDto) {}

  async verifyOtp(verifyDto: VerifyOtpDto) {
    const otpExist = await this.otpSchema.findById(verifyDto.otpId);
    if (!otpExist) {
      throw new NotFoundException('Send otp before verify');
    }
    var checkOtp = otpExist.otp == verifyDto.otp;
    if (!checkOtp) {
      throw new BadRequestException('Invalid OTP');
    }
    const validateObj =
      otpExist.otpType == OtpType.email
        ? { email: otpExist.email }
        : { mobileNo: otpExist.mobileNo };
    const user = await this.userSchema.findOne(validateObj);
    var tokenDto = new TokenDto();
    tokenDto.userId = user.id;
    return this.tokenService.getToken(tokenDto);
  }

  generateOTP(): any {
    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    var expiredAt = new Date(Date.now() + 5 * 60 * 1000);
    return { otp, expiredAt };
  }
}
