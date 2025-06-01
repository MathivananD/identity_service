import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from 'src/dto/token.dto';

@Injectable()
export class CustomTokenService {
  constructor(private readonly jwtService: JwtService) {}

  getToken(tokenDto: TokenDto) {
    return {
      accessToken: this.generateAccessToken(tokenDto),
      refreshToken: this.generateRefreshToken(tokenDto),
    };
  }

  generateAccessToken(tokenDto: TokenDto): string {
    const payload = {
      sub: tokenDto.userId,
      userType: tokenDto.userType,
    };
    // user data in the token
    return this.jwtService.sign(payload, { expiresIn: '2d' }); // Access token expires in 1 hour
  }

  // Function to generate a refresh token
  generateRefreshToken(tokenDto: TokenDto) {
    const payload = {
      sub: tokenDto.userId,
      userType: tokenDto.userType,
    }; // user data in the token
    return this.jwtService.sign(payload); // Refresh token expires in 7 days
  }
}
