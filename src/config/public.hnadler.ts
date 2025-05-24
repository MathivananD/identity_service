import { SetMetadata } from "@nestjs/common";

export const PublicKey="isPublic";
export const Public=()=>SetMetadata("isPublic",true);
export const Private=()=>SetMetadata("isPublic",false);