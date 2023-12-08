import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EggDocument = mongoose.HydratedDocument<Egg>;

@Schema({ _id: false })
class EggMetadata {
  @Prop()
  class: string;

  @Prop()
  xp: string;

  @Prop()
  creationYear: string;

  @Prop()
  image: string;
}

@Schema({ timestamps: true })
export class Egg {
  @Prop()
  tokenId: string;

  @Prop()
  owner: string;

  @Prop()
  status: string;

  @Prop()
  cap: string;

  @Prop()
  metadata: EggMetadata;

  @Prop()
  hashes: string[];
}

export const EggSchema = SchemaFactory.createForClass(Egg);
