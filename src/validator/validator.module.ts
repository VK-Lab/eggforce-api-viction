import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Validator, ValidatorSchema } from './schemas/validator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Validator.name, schema: ValidatorSchema },
    ]),
  ],
  controllers: [ValidatorController],
  providers: [ValidatorService],
})
export class ValidatorModule {}
