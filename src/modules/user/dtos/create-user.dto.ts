import { Prop } from '@nestjs/mongoose';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @Prop()
  @IsString()
  name: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  @IsString()
  password: string;
}
