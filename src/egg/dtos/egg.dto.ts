import { Expose, Type } from 'class-transformer';

class EggMetadataDto {
  @Expose()
  class: string;
  @Expose()
  level: string;
  @Expose()
  image: string;
  @Expose()
  creationYear: string;
}

export class EggDto {
  @Expose()
  tokenId: string;
  @Expose()
  owner: string;
  @Expose()
  status: string;
  @Expose()
  stakedAmount: number;
  @Expose()
  @Type(() => EggMetadataDto)
  metadata: EggMetadataDto;
}
