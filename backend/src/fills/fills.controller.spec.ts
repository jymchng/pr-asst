import { Test, TestingModule } from '@nestjs/testing';
import { FillsController } from './fills.controller';
import { FillsService } from './fills.service';

describe('FillsController', () => {
  let controller: FillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FillsController],
      providers: [FillsService],
    }).compile();

    controller = module.get<FillsController>(FillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
