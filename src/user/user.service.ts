import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async increaseSnc(publicKey: string, snc: bigint) {
    let user = await this.userModel.findOne({ publicKey });
    if (!user) {
      user = new this.userModel({ publicKey, snc: '0', pendingSnc: '0' });
    }
    user.snc = (BigInt(user.snc) + snc).toString();
    return user.save();
  }
}
