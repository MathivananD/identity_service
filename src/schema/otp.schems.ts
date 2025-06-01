import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Timestamp } from "rxjs";

@Schema({timestamps:true})
export class Otp{
@Prop()
otp:string;
@Prop()
mobileNo:string;
@Prop()
email:string;
@Prop()
otpType:string;
@Prop()
expiredAt:Date
}

export const OtpSchema=SchemaFactory.createForClass(Otp);