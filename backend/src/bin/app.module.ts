import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FillEntity } from '../fills/entities/fill.entity';
import { FillsModule } from '../fills/fills.module';
import { sqlConnectionOptions } from '../core/app.constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...sqlConnectionOptions,
      entities: [FillEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
    FillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
