import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EggDocument = mongoose.HydratedDocument<Egg>;

@Schema({ _id: false })
class EggMetadata {
  @Prop()
  Class: string;

  @Prop()
  XP: string;

  @Prop()
  Level: string;

  @Prop()
  'Year of creation': string;

  @Prop()
  token_uri: string;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Egg {
  @Prop()
  tokenId: string;

  @Prop()
  owner: string;

  @Prop()
  status: string;

  @Prop()
  stakedAmount: string;

  @Prop()
  metadata: EggMetadata;

  @Prop()
  validator: string;

  @Prop()
  hashes: string[];

  @Prop()
  contractAddress: string;

  nextLevelXp: number;
}

const EggSchema = SchemaFactory.createForClass(Egg);

EggSchema.virtual('nextLevelXp').get(function () {
  let currentLvl: number;
  switch (this.metadata.Level) {
    case 'Rock':
      currentLvl = 1;
      break;
    case 'Silver':
      currentLvl = 2;
      break;
    case 'Gold':
      currentLvl = 3;
      break;
    default:
      currentLvl = 4;
      break;
  }
  if (currentLvl === 4) return 0;
  return (currentLvl + 1) ** 3 * 12 - 12;
});

export { EggSchema };
