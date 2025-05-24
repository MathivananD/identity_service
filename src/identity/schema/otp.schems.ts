import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";

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
}

export const OtpSchema=SchemaFactory.createForClass(Otp);