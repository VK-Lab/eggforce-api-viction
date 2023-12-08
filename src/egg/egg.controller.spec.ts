import { Test, TestingModule } from '@nestjs/testing';
import { EggController } from './egg.controller';

describe('EggController', () => {
  let controller: EggController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EggController],
    }).compile();

    controller = module.get<EggController>(EggController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
