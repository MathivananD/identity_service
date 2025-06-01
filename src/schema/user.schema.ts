import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  mobileNo: string;
  @Prop()
  email: string;
  @Prop()
  name: string;
  @Prop()
  password: string;
  @Prop({default:false})
  verified:boolean;
  @Prop({default:false})
  isDeleted:boolean
  @Prop({default:false})
  isBlocked:boolean
  @Prop()
  fcmToken:string
}
export const UserSchema = SchemaFactory.createForClass(User);
