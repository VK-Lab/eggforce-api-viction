import { Controller, Get } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ValidatorDto } from './dtos/validator.dto';

@Controller('')
export class ValidatorController {
  constructor(private validatorService: ValidatorService) {}
  @Get('validators')
  @Serialize(ValidatorDto)
  getValidators() {
    return this.validatorService.getValidators();
  }
}
