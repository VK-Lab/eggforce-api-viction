import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ValidatorDocument = HydratedDocument<Validator>;

class Position {
  @Prop()
  lat: number;
  @Prop()
  lng: number;
}

@Schema({ timestamps: true })
export class Validator {
  @Prop()
  publicKey: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop()
  position: Position;

  @Prop()
  isActiveValidator: boolean;
}

export const ValidatorSchema = SchemaFactory.createForClass(Validator);
