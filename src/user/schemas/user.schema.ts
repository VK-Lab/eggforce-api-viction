import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  publicKey: string;

  @Prop()
  snc: string;

  @Prop()
  pendingSnc: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
