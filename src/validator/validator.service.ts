import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Validator } from './schemas/validator.schema';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidatorService {
  private readonly logger = new Logger(ValidatorService.name);
  constructor(
    @InjectModel(Validator.name) private userModel: Model<Validator>,
    private configService: ConfigService,
  ) {}
  async getValidators() {
    const supportedValidators = await this.userModel.find();
    console.log(axios.defaults.baseURL);

    const response = await axios.get('/candidates/masternodes', {
      baseURL: this.configService.get<string>('MASTER_API_BASE_URI'),
    });
    if (response.status !== 200) {
      this.logger.error('Failed to get master node status');
      return;
    }
    const masterNodes = response.data.items;
    return supportedValidators.map((supportedValidator) => {
      const isActive = masterNodes.find(
        (masterNode: any) =>
          masterNode.candidate === supportedValidator.publicKey &&
          masterNode.status === 'MASTERNODE',
      );
      return {
        ...supportedValidator.toJSON(),
        isActiveValidator: !!isActive,
      };
    });
  }
}
