import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateFillDto } from './dto/create-fill.dto';
import { UpdateFillDto } from './dto/update-fill.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FillEntity } from './entities/fill.entity';
import { appLogger } from '../core/logger';
import { printAnyObjectWithStandardFormat } from '../vendors/jacob-bot-common/dist/src/utils/printing';
import { appConstants } from '../core/app.constants';
import { QueryDTO } from './dto/query-fill.dto';
import { formatDateToString } from '../core/common/utils';
import { PNLResult } from './dto/pnl-result.dto';
import moment from 'moment';

@Injectable()
export class FillsService implements OnModuleInit {
  tableName: string;

  constructor(
    @InjectRepository(FillEntity)
    private fillsRepository: Repository<FillEntity>,
  ) {
    appLogger.info(`\`fillsRepository\` is initialized in \`FillsService\``);
    this.tableName = appConstants.databaseRelated.tables.fills;
  }

  async onModuleInit() {
    if (!(await this.repositoryHasRecords())) {
      const result = await this.fillsRepository.query(
        `SELECT COUNT(*) as count FROM ${this.tableName}`,
      );
      const errMsg = `\`fillsRepository\` is empty; it has ${printAnyObjectWithStandardFormat(result[0].count)} rows`;
      appLogger.error(errMsg);
      throw new Error(errMsg);
    }
  }

  async repositoryHasRecords(): Promise<boolean> {
    return (await this.fillsRepository.count()) != 0;
  }

  create(createFillDto: CreateFillDto) {
    appLogger.info(
      `\`createFillDto\` = ${printAnyObjectWithStandardFormat(createFillDto)} is initialized in \`FillsService::create\``,
    );
    return 'This action adds a new fill';
  }

  async findAll() {
    const fills = await this.fillsRepository.find();
    return fills.map((fill) => ({
      ...fill,
      timestamp: new Date(fill.timestamp).toLocaleTimeString(), // Convert to ISO string if needed
    }));
  }

  async count() {
    return this.fillsRepository.count();
  }

  findOne(id: number) {
    return `This action returns a #${id} fill`;
  }

  update(id: number, updateFillDto: UpdateFillDto) {
    appLogger.info(
      `\`updateFillDto\` = ${printAnyObjectWithStandardFormat(updateFillDto)} is initialized in \`FillsService::update\``,
    );
    return `This action updates a #${id} fill`;
  }

  remove(id: number) {
    return `This action removes a #${id} fill`;
  }

  async getPNL(query: QueryDTO): Promise<any> {
    // const qb = this.fillsRepository.createQueryBuilder();

    // if (query.exchange) {
    //   qb.andWhere('fills.exchange = :exchange', { exchange: query.exchange });
    // }

    // if (query.symbol) {
    //   qb.andWhere('fills.symbol = :symbol', { symbol: query.symbol });
    // }

    let startDateTime: Date;
    if (query.startDate) {
      startDateTime = new Date(query.startDate);
      console.log(
        `inside function \`getPNL\`; \`startDateTime\` = ${startDateTime}`,
      );
      // qb.andWhere(
      //   "datetime(fills.timestamp / 1000000, 'unixepoch') >= :startDateTime",
      //   { startDateTime },
      // );
    } else {
      startDateTime = new Date(0);
      console.log(
        `inside function \`getPNL\`; \`startDateTime\` = ${startDateTime}`,
      );
    }

    let endDateTime: Date;
    if (query.endDate) {
      endDateTime = new Date(query.endDate);
      console.log(
        `inside function \`getPNL\`; \`endDateTime\` = ${endDateTime}`,
      );
      // qb.andWhere(
      //   "datetime(fills.timestamp / 1000000, 'unixepoch') <= :endDateTime",
      //   { endDateTime },
      // );
    } else {
      endDateTime = new Date();
      console.log(
        `inside function \`getPNL\`; \`endDateTime\` = ${endDateTime}`,
      );
    }

    let groupByFormat: string;

    switch (query.groupBy) {
      case 'second':
        groupByFormat = '%Y-%m-%d %H:%M:%S';
        break;
      case 'minute':
        groupByFormat = '%Y-%m-%d %H:%M';
        break;
      case 'hour':
        groupByFormat = '%Y-%m-%d %H';
        break;
      case 'day':
      default:
        groupByFormat = '%Y-%m-%d';
        break;
    }

    // const queryRunner = handleNullOrUndefinedWithErrorMessage(
    //   this.fillsRepository.queryRunner,
    //   '`queryRunner` is missing in `this.fillsRepository`',
    // );
    const sqlQuery = `
    WITH RunningTotals AS (
      SELECT
          timestamp,
          datetime(timestamp / 1000000, 'unixepoch') AS datetime,
          strftime('${groupByFormat}', datetime(timestamp / 1000000, 'unixepoch')) AS time_group,
          fill_price,
          fill_quantity,
          side,
          fees,
          SUM(CASE WHEN side = 'BUY' THEN fill_quantity ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) - 
          SUM(CASE WHEN side = 'SELL' THEN fill_quantity ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) AS net_quantity,
          SUM(CASE WHEN side = 'BUY' THEN fill_quantity * fill_price ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) - 
          SUM(CASE WHEN side = 'SELL' THEN fill_quantity * fill_price ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) AS net_value
      FROM ${this.tableName}
      WHERE 
          exchange = '${query.exchange}' AND
          symbol = '${query.symbol}' AND
          datetime(timestamp / 1000000, 'unixepoch') >= '${formatDateToString(startDateTime)}' AND 
          datetime(timestamp / 1000000, 'unixepoch') <= '${formatDateToString(endDateTime)}'
  )
  SELECT
      time_group as timeGroup,
      SUM(CASE WHEN side = 'SELL' THEN fill_quantity * (fill_price - (net_value / net_quantity)) ELSE 0 END) - SUM(fees) AS pnl
  FROM RunningTotals
  GROUP BY time_group
  ORDER BY time_group ASC;`;
    console.log(`inside function \`getPNL\`; \`sqlQuery\` = ${sqlQuery}`);
    const results: Array<PNLResult> =
      await this.fillsRepository.query(sqlQuery);
    const final_results = results.map((value) => {
      const date = moment(value.timeGroup, true);
      value.timeGroup = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      return value;
    });
    console.log(
      `inside function \`getPNL\`; \`results[0]\` = ${final_results[0]}`,
    );
    return final_results;
  }
}
