import { forwardRef, Module } from '@nestjs/common';
import { EggService } from './egg.service';
import { EggController } from './egg.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Egg, EggSchema } from './schemas/egg.schema';
import { Epoch, EpochSchema } from './schemas/epoch.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Egg.name, schema: EggSchema },
      { name: Epoch.name, schema: EpochSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [EggService],
  controllers: [EggController],
  exports: [EggService],
})
export class EggModule {}
