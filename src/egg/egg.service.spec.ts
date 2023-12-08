import { Test, TestingModule } from '@nestjs/testing';
import { EggService } from './egg.service';

describe('EggService', () => {
  let service: EggService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EggService],
    }).compile();

    service = module.get<EggService>(EggService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
