import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Egg } from './schemas/egg.schema';
import { Model } from 'mongoose';
import {
  Address,
  createPublicClient,
  decodeEventLog,
  Hash,
  http,
  parseAbi,
  PublicClient,
} from 'viem';
import { victionTestnet } from '../chain/victionTesnet';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Epoch } from './schemas/epoch.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class EggService {
  private publicClient: PublicClient;
  private readonly logger = new Logger(EggService.name);
  constructor(
    @InjectModel(Egg.name) private eggModel: Model<Egg>,
    @InjectModel(Epoch.name) private epochModel: Model<Epoch>,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.publicClient = createPublicClient({
      chain: victionTestnet,
      transport: http(),
    });
    axios.defaults.baseURL = configService.get<string>('SCAN_API_BASE_URI');
  }
  async getEggMetadata(tokenId: string) {
    const egg = await this.eggModel.findOne({ tokenId: tokenId }).exec();
    if (!egg) {
      throw new NotFoundException(`Egg #${tokenId} not found`);
    }
    return egg.metadata;
  }

  async createEgg(tokenId: string, owner: string) {
    let egg = await this.eggModel.findOne({ tokenId: tokenId }).exec();
    if (!egg) {
      const CLASSES = ['Earth', 'Fire', 'Water', 'Wood', 'Metal'];
      const eggClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];

      egg = await this.eggModel.create({
        tokenId: tokenId,
        owner,
        metadata: {
          class: eggClass,
          level: 'rock',
          image: `https://assets.eggforce.io/egg/${eggClass.toLowerCase()}-rock.png`,
          creationYear: '2023',
        },
      });
      await egg.save();
    }
    return egg;
  }

  async getEggsByOwner(owner: string) {
    return await this.eggModel.find({ owner: owner }).exec();
  }

  async incubate(tokenId: string, txHash: Hash) {
    const egg = await this.eggModel.findOne({ tokenId: tokenId }).exec();
    if (!egg) {
      throw new NotFoundException(`Egg #${tokenId} not found`);
    }
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    if (receipt.status !== 'success') {
      throw new BadRequestException(`Transaction failed`);
    }
    const event = decodeEventLog({
      abi: parseAbi([
        'event Vote( address _voter, address _candidate, uint256 _cap)',
      ]),
      data: receipt.logs[0].data,
      topics: [
        '0x66a9138482c99e9baf08860110ef332cc0c23b4a199a53593d8db0fc8f96fbfc',
      ],
    });
    if (egg.status !== 'incubating') {
      egg.status = 'incubating';
    }
    egg.cap = (BigInt(egg.cap) + event.args['_cap']).toString();
    egg.hashes.push(txHash);
    await egg.save();
    return egg;
  }

  async stop(tokenId: string, txHash: Hash) {
    const egg = await this.eggModel.findOne({ tokenId: tokenId }).exec();
    if (!egg) {
      throw new NotFoundException(`Egg #${tokenId} not found`);
    }
    if (egg.status !== 'incubating') {
      throw new BadRequestException(`Egg #${tokenId} is not incubating`);
    }
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    if (receipt.status !== 'success') {
      throw new BadRequestException(`Transaction failed`);
    }
    const event = decodeEventLog({
      abi: parseAbi([
        'event Unvote( address _voter, address _candidate, uint256 _cap)',
      ]),
      data: receipt.logs[0].data,
      topics: [
        '0xaa0e554f781c3c3b2be110a0557f260f11af9a8aa2c64bc1e7a31dbb21e32fa2',
      ],
    });
    egg.status = 'stop';
    egg.cap = '0';
    egg.hashes.push(txHash);
    await egg.save();
    return egg;
  }

  @Cron('*/10 * * * * *')
  private async handleEggRewards() {
    const response = await axios.get('/epoch/list?limit=1&offset=1');
    if (response.status !== 200) {
      this.logger.error('Failed to get epoch list');
      return;
    }
    const epochData = response.data.data[0];
    if (await this.epochModel.exists({ epoch: epochData.epoch })) {
      return;
    }
    this.logger.log(`New epoch: ${epochData.epoch}. Calculating rewards...`);
    // Get epoch rewards
    await this.calculateEggRewards(epochData.epoch);

    // Add epoch to processed
    const epoch = await this.epochModel.create({
      epoch: epochData.epoch,
      startBlock: epochData.startBlock,
    });
    await epoch.save();
  }

  private async calculateEggRewards(epoch: number) {
    const response = await axios.get(`/epoch/${epoch}/reward`);
    if (response.status !== 200) {
      this.logger.error(`Failed to get epoch ${epoch} rewards`);
      return;
    }
    const rewards = response.data.data;
    for (const reward of rewards) {
      const eggs = await this.eggModel.find({
        owner: reward.address,
        status: 'incubating',
      });
      if (!eggs.length) {
        continue;
      }
      const totalCap = eggs.reduce(
        (total, egg) => total + BigInt(egg.cap),
        BigInt(0),
      );
      // Get on-chain cap
      const onchainCap = await this.publicClient.readContract({
        address: this.configService.get<string>(
          'VALIDATOR_CONTRACT',
        ) as Address,
        abi: parseAbi([
          'function getVoterCap(address _candidate, address _voter) public view returns(uint256)',
        ]),
        functionName: 'getVoterCap',
        args: [reward.validator, reward.address],
      });
      if (totalCap < onchainCap) {
        const rewardAmount = (BigInt(reward.reward) * totalCap) / onchainCap;
        await this.userService.increaseSnc(reward.address, rewardAmount);
      }
    }
  }
}
