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
}
export const UserSchema = SchemaFactory.createForClass(User);
