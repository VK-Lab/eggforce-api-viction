import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EggService } from './egg.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { EggDto } from './dtos/egg.dto';
import { Hash } from 'viem';

@Controller('egg')
export class EggController {
  constructor(private eggService: EggService) {}
  @Get('metadata/:id')
  getEggMetadata(@Param('id') id: string) {
    return this.eggService.getEggMetadata(id);
  }

  @Post(':id/incubate')
  @Serialize(EggDto)
  incubate(@Param('id') id: string, @Body('txHash') txHash: Hash) {
    return this.eggService.incubate(id, txHash);
  }

  @Post(':id/stop')
  @Serialize(EggDto)
  stop(@Param('id') id: string, @Body('txHash') txHash: Hash) {
    return this.eggService.stop(id, txHash);
  }

  @Post(':id/claim')
  @Serialize(EggDto)
  claim(@Param('id') id: string, @Body('snc') snc: string) {
    return this.eggService.claim(id, BigInt(snc));
  }
}
