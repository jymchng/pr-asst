import { printAnyObjectWithStandardFormat } from '../vendors/jacob-bot-common/dist/src/utils/printing';
import { handleNullOrUndefinedWithErrorMessage } from '../vendors/jacob-bot-common/dist/src/utils/handle.null.etc';
import { appConfigs } from '../core/common/configs';
import { appCryptoSecrets } from '../core/common/secrets';
import { appConstants, sqlConnectionOptions } from '../core/app.constants';
import { appLogger } from '../core/logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function ensureTableExists() {
  const fillsTableName = appConstants.databaseRelated.tables.fills;
  const dataSource = await new DataSource(sqlConnectionOptions).initialize();
  const queryRunner = await dataSource.createQueryRunner();
  const tableExists = queryRunner.hasTable(fillsTableName);
  if (!tableExists) {
    throw new Error('The "fills" table does not exist.');
  }
  const sqlQuery = `SELECT COUNT(*) as count FROM ${fillsTableName}`;
  appLogger.info(`\`sqlQuery\` = ${sqlQuery}`);
  const result: { count: number }[] = handleNullOrUndefinedWithErrorMessage(
    await queryRunner.query(sqlQuery),
    `query \`${sqlQuery}\` has failed`,
  );
  const numRows = handleNullOrUndefinedWithErrorMessage(
    result[0],
    '`result` is undefined',
  );
  appLogger.info(`Number of rows in \`${fillsTableName}\` = ${numRows.count}`);

  const buySideSqlQuery = `SELECT COUNT(*) as count FROM ${fillsTableName} WHERE side = 'BUY'`;
  const buySideResult: { count: number }[] =
    handleNullOrUndefinedWithErrorMessage(
      await queryRunner.query(buySideSqlQuery),
      `query \`${sqlQuery}\` has failed`,
    );
  const buySideNumRows = handleNullOrUndefinedWithErrorMessage(
    buySideResult[0],
    '`buySideResult` is undefined',
  );
  appLogger.info(
    `Number of rows in \`${fillsTableName}\` where side = 'BUY' = ${buySideNumRows.count}`,
  );
  await queryRunner.release();
}

appLogger.info('Now trying to print `appConfigs`!');
appLogger.info(printAnyObjectWithStandardFormat(appConfigs));
appLogger.info('Now trying to print `appCryptoSecrets`!');
appLogger.info(printAnyObjectWithStandardFormat(appCryptoSecrets));
appLogger.info(
  'App tests completed! App is successfully set up! Congratulations!',
);

async function bootstrap() {
  const nestLogger = new Logger();
  await ensureTableExists();
  const app = await NestFactory.create(AppModule);
  await app.listen(appConfigs.PORT);
  nestLogger.log(`NestJS App is now listening at port = ${appConfigs.PORT}`);
}
bootstrap();
