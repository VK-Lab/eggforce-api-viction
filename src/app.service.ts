import { Injectable, Logger } from '@nestjs/common';
import {
  Address,
  createPublicClient,
  parseAbi,
  PublicClient,
  webSocket,
} from 'viem';
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
    this.publicClient.watchContractEvent({
      address: this.configService.get<string>(
        'NFT_CONTRACT_ADDRESS',
      ) as Address,
      abi: parseAbi([
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
      ]),
      eventName: 'Transfer',
      args: { from: '0x0000000000000000000000000000000000000000' },
      onLogs: (logs) => {
        const args = logs[0].args;
        this.logger.log(`Egg #${args.tokenId} minted`);
        this.eggService.createEgg(args.tokenId.toString(), args.to);
      },
      poll: true,
      pollingInterval: 500,
    });
  }
}
