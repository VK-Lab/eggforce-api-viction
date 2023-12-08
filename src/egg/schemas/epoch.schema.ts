import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EpochDocument = mongoose.HydratedDocument<Epoch>;

@Schema({ timestamps: true })
export class Epoch {
  @Prop()
  epoch: number;
  @Prop()
  startBlock: number;
}

export const EpochSchema = SchemaFactory.createForClass(Epoch);
