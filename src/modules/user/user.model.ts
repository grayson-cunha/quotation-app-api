import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false },
})
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  hashPassword: string;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
