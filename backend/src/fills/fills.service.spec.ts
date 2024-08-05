import { Test, TestingModule } from '@nestjs/testing';
import { FillsService } from './fills.service';

describe('FillsService', () => {
  let service: FillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FillsService],
    }).compile();

    service = module.get<FillsService>(FillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
