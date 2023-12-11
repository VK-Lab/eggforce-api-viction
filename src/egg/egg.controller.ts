import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EggService } from './egg.service';
import { EggDto } from './dtos/egg.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { Hash } from 'viem';

@Controller('egg')
export class EggController {
  constructor(private eggService: EggService) {}
  @Get('metadata/:id')
  getEggMetadata(@Param('id') id: string) {
    return this.eggService.getEggMetadata(id);
  }

  @Get('/summary')
  async getEggSummary(@Query('publicKey') publicKey: string) {
    const eggs = await this.eggService.getEggsByOwner(publicKey, 1, 0);
    const countByClass = eggs.reduce(
      (acc, egg) => {
        acc[egg.metadata.Class] = (acc[egg.metadata.Class] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      classes: countByClass,
    };
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
