import { Expose, Type } from 'class-transformer';

class EggMetadataDto {
  @Expose()
  Class: string;
  @Expose()
  Level: string;
  @Expose()
  token_uri: string;
  @Expose()
  'Year of creation': string;
  @Expose()
  XP: string;
}

export class EggDto {
  @Expose()
  tokenId: string;
  @Expose()
  owner: string;
  @Expose()
  status: string;
  @Expose()
  stakedAmount: string;
  @Expose()
  @Type(() => EggMetadataDto)
  metadata: EggMetadataDto;
  @Expose()
  contractAddress: string;
  @Expose()
  nextLevelXp: number;
}
