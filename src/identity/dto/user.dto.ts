import { IsEmail, IsOptional, Matches } from 'class-validator';

export class UserDto {
  @Matches(/^\d+$/, { message: 'Mobile number must contain digits only' })
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobileNo: string;
  @IsEmail()
  @IsOptional()
  emial: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: string;
}
