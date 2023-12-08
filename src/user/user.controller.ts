import { Controller, Get, Param, Query } from '@nestjs/common';
import { EggService } from '../egg/egg.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private eggService: EggService,
    private userService: UserService,
  ) {}
  @Get(':publicKey/nfts')
  async getUserEggs(
    @Param('publicKey') publicKey: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 0,
  ) {
    const itemCount = await this.eggService.countEggsByOwner(publicKey);
    return {
      nfts: await this.eggService.getEggsByOwner(publicKey, page, limit),
      itemCount,
      pageCount: Math.ceil(itemCount / limit),
    };
  }

  @Get(':publicKey')
  @Serialize(UserDto)
  getUser(@Param('publicKey') publicKey: string) {
    return this.userService.getUser(publicKey);
  }
}
