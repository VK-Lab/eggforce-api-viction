import { Controller, Get, Param } from '@nestjs/common';
import { EggService } from '../egg/egg.service';
import { EggDto } from '../egg/dtos/egg.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private eggService: EggService,
    private userService: UserService,
  ) {}
  @Get(':publicKey/egg')
  @Serialize(EggDto)
  getUserEggs(@Param('publicKey') publicKey: string) {
    return this.eggService.getEggsByOwner(publicKey);
  }

  @Get(':publicKey')
  @Serialize(UserDto)
  getUser(@Param('publicKey') publicKey: string) {
    return this.userService.getUser(publicKey);
  }
}
