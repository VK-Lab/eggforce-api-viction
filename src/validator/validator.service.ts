import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Validator } from './schemas/validator.schema';

@Injectable()
export class ValidatorService {
  constructor(
    @InjectModel(Validator.name) private userModel: Model<Validator>,
  ) {}
  getValidators() {
    return this.userModel.find();
  }
}
