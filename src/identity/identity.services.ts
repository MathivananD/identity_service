import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OtpDto, VerifyOtpDto } from './dto/otp.dto';
import { OtpType } from 'src/common/utils/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './schema/otp.schems';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(Otp.name) private otpSchema: Model<Otp>,
    @InjectModel(User.name) private userSchema: Model<User>,
    private jwtService: JwtService,
  ) {}

  async triggerOtpService(loginDto: OtpDto) {
    var checkFileds = this.validationFields(loginDto);
    if (checkFileds != null) {
      return checkFileds;
    }
    var nameObjct = {};
    if (loginDto.otpType == OtpType.email) {
      nameObjct = { email: loginDto.email };
    } else if (loginDto.otpType == OtpType.sms) {
      nameObjct = { mobileNo: loginDto.mobileNo };
    }
    var user = await this.userSchema.findOne(nameObjct);
    if (!user) {
      var newUser = await this.userSchema.create(nameObjct);
      nameObjct = { mobileNo: newUser.mobileNo };
    }
    var otp = this.generateOTP();

    return this.otpSchema.create({
      ...otp,
      ...nameObjct,
    });
  }

  async verifyOtp(otpDto: VerifyOtpDto) {
    try {
      var otp = await this.otpSchema.findById(otpDto.otpId);

      if (otp == null) {
        throw new NotFoundException('Otp not found');
      }

      var checkOtp = this.checkMatchOtp(otp.otp, otpDto.otp);

      if (!checkOtp) {
        throw new BadRequestException('Incorrect otp');
      }
      const user = await this.userSchema.findOne({ mobileNo: otp.mobileNo });
      await this.otpSchema.findByIdAndDelete(otpDto.otpId);

      return this.getToken(user);
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  getToken(user: any) {
    return {
      acccessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
  async loginWithPassword(userDto: UserDto) {
    var user = await this.userSchema
      .findOne({ mobileNo: userDto.mobileNo })
      .exec();
    if (!user) {
      throw new NotFoundException();
    }

    var checkPassword = await this.comparePassword(
      userDto.password,
      user.password,
    );
    if (!checkPassword) {
      throw new BadRequestException();
    }
    return this.getToken(user);
  }

  async checkUserRegistereOrNot(mobileNo: string) {
    var user = await this.userSchema.findOne({ mobileNo: mobileNo });
    if (!user) {
      throw new HttpException('123', HttpStatus.NOT_FOUND);
    } else {
      if (user.name == undefined) {
        throw new HttpException('123', HttpStatus.NOT_FOUND);
      }
    }
    return user;
  }

  async createUser(userDto: UserDto) {
    const user = await this.userSchema.findOne({ mobileNo: userDto.mobileNo });
    if (user) {
      console.log(user.verified);

      if (user.verified) {
        throw new BadRequestException('User already');
      }
    }
    if (userDto.password != null) {
      userDto.password = await this.hashPassword(userDto.password);
    }
    var newObj = {
      ...userDto,
      verified: true,
    };

    return this.userSchema.create(newObj);
  }

  checkMatchOtp(otp: string, incomongOtp: string): boolean {
    return otp == incomongOtp;
  }

  triggerEmailOtp(loginDto: OtpDto) {
    if (loginDto.otpType == OtpType.email) {
      if (loginDto.email == '' || loginDto.email == undefined) {
        return 'Email is mandatory';
      }

      var otp = this.generateOTP();
      return { _id: 'from mail', ...otp };
    }
  }

  triggerMobileOtp(loginDto: OtpDto) {
    if (loginDto.otpType == OtpType.sms) {
      if (loginDto.mobileNo == '' || loginDto.mobileNo == undefined) {
        return 'Mobile is mandatory';
      }
    }
  }

  validationFields(loginDto: OtpDto): string | null {
    if (loginDto.otpType == OtpType.sms) {
      if (loginDto.mobileNo == '' || loginDto.mobileNo == undefined) {
        return 'Mobile is mandatory';
      }
    } else if (loginDto.otpType == OtpType.email) {
      if (loginDto.email == '' || loginDto.email == undefined) {
        return 'Email is mandatory';
      }
    }
    return null;
  }

  generateOTP(): any {
    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    var expiredAt = new Date(Date.now() + 5 * 60 * 1000);
    return { otp, expiredAt };
  }

  generateAccessToken(user: any): string {
    const payload = {
      sub: user._id,
    };
    // user data in the token
    return this.jwtService.sign(payload, { expiresIn: '2d' }); // Access token expires in 1 hour
  }

  // Function to generate a refresh token
  generateRefreshToken(user: any) {
    const payload = { sub: user._id }; // user data in the token
    return this.jwtService.sign(payload); // Refresh token expires in 7 days
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
