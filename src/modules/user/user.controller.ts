import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Model } from 'mongoose';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './user.model';

const scrypt = promisify(_scrypt);

@Controller('/users')
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    const userExists = await this.userModel.findOne({
      email: newUser.email,
    });

    if (userExists) {
      throw new BadRequestException(
        `User with email ${newUser.email} already exists`,
      );
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(newUser.password, salt, 32)) as Buffer;

    const hashPassword = `${hash.toString('hex')}`;

    return this.userModel.create({ ...newUser, hashPassword });
  }
}
