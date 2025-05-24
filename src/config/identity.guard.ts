import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PublicKey } from './public.hnadler';
import { jwtConstants } from 'src/app.module';

@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
  
    if (isPublic) {

      return true;
    }
    const requests = context.switchToHttp().getRequest();
    try {
       
      const token = this.extractTokenFromHeader(requests);
      //check toke is there or not
      if (!token) {
        throw new UnauthorizedException('Token Required');
      }

      // check incoming token is expired or valid token
       const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      requests.userId = payload.sub;
      requests.userType = payload.userType;
       return true;
    } catch (error) {
         if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expired');
    }
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
