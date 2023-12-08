import { Controller, forwardRef, Get, Inject, Param } from '@nestjs/common';
import { EggService } from '../egg/egg.service';
import { EggDto } from '../egg/dtos/egg.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('user')
export class UserController {
  constructor(private eggService: EggService) {}
  @Get(':publicKey/egg')
  @Serialize(EggDto)
  getUserEggs(@Param('publicKey') publicKey: string) {
    return this.eggService.getEggsByOwner(publicKey);
  }
}
