import { Injectable, Logger } from '@nestjs/common';
import { Address, createPublicClient, PublicClient, webSocket } from 'viem';
import { ConfigService } from '@nestjs/config';
import { EggService } from './egg/egg.service';
import { victionTestnet } from './chain/victionTesnet';

@Injectable()
export class AppService {
  private publicClient: PublicClient;
  private readonly logger = new Logger(AppService.name);
  constructor(
    private configService: ConfigService,
    private eggService: EggService,
  ) {
    this.publicClient = createPublicClient({
      chain: victionTestnet,
      transport: webSocket(),
    });
  }

  watchMintEvent() {
    this.publicClient.watchEvent({
      address: this.configService.get<string>(
        'NFT_CONTRACT_ADDRESS',
      ) as Address,
      event: {
        name: 'Transfer',
        inputs: [
          { type: 'address', indexed: true, name: 'from' },
          { type: 'address', indexed: true, name: 'to' },
          { type: 'uint256', indexed: true, name: 'tokenId' },
        ],
        type: 'event',
        args: {
          from: '0x0000000000000000000000000000000000000000',
        },
      },
      onLogs: (logs) => {
        const args = logs[0].args;
        this.logger.log(`Egg #${args.tokenId} minted`);
        this.eggService.createEgg(args.tokenId.toString(), args.to);
      },
    });
  }
}
