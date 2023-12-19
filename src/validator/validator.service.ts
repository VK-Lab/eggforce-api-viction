import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Validator } from './schemas/validator.schema';

@Injectable()
export class ValidatorService {
  private readonly logger = new Logger(ValidatorService.name);
  constructor(
    @InjectModel(Validator.name) private userModel: Model<Validator>,
  ) {}
  async getValidators() {
    return this.userModel.find();
  }
}
