import { Module } from '@nestjs/common';
import { FillsService } from './fills.service';
import { FillsController } from './fills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FillEntity } from './entities/fill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FillEntity])],
  controllers: [FillsController],
  providers: [FillsService],
})
export class FillsModule {}
