import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { joinRelativeToPackageJson } from '../vendors/jacob-bot-common/dist/src/utils/path';
import { appConfigs } from './common/configs';
import * as fs from 'fs';

export type AppEnvEnum = {
  development: 'development';
  production: 'production';
};

export const AppEnvEnum: AppEnvEnum = {
  development: 'development',
  production: 'production',
} as const;

export const appConstants = {
  loggingRelated: {
    logFilesDirNameOnDisk: `${appConfigs.NODE_ENV}_logs`,
  },
  databaseRelated: {
    type: 'sqlite',
    databaseFolder: 'db',
    databaseFileName: 'trades',
    databaseFileExtension: 'sqlite',
    tables: {
      fills: 'fills',
    },
  },
} as const;

const databaseFilePath = `${joinRelativeToPackageJson(appConstants.databaseRelated.databaseFolder, `${appConstants.databaseRelated.databaseFileName}.${appConstants.databaseRelated.databaseFileExtension}`)}`;

if (!fs.existsSync(databaseFilePath)) {
  throw new Error(`\`databaseFilePath\` = ${databaseFilePath} does not exist`);
} else {
  console.log(`\`databaseFilePath\` exists and is at ${databaseFilePath}`);
}

export const sqlConnectionOptions: SqliteConnectionOptions = {
  database: databaseFilePath,
  type: appConstants.databaseRelated.type,
};
