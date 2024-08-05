/**
 * This file is supposedly generated by `${PROJECT_DIR}/build.ts` in the template.
 * But for this exercise, it isn't because `jacob-bot-common` is a private repository that cannot be `npm install` by whose who
 * are not given access to the private repository, hence it is vendored.
 */
import { Secret } from '../../../vendors/jacob-bot-common/dist/src/secret';
import { joinRelativeToPackageJson } from '../../../vendors/jacob-bot-common/dist/src/utils/path';

export type CryptoSecrets = {
  ENCRYPTION_SECRET_KEY: Secret<string>;
  TELEGRAM_BOT_KEY: Secret<string>;
  MNEMONIC_SEED_PHRASE: Secret<string>;
  MORALIS_SECRET: Secret<string>;
  COVALENT_API_KEY: Secret<string>;
  PRISMA_FIELD_ENCRYPTION_KEY: Secret<string>;
  CLOAK_KEYCHAIN: Secret<string>;
  EXPRESS_SESSION_SECRET: Secret<string>;
  ACCESS_TOKEN_SECRET: Secret<string>;
  REFRESH_TOKEN_SECRET: Secret<string>;
  PRIVATE_KEY: Secret<number>;
  JWT_SECRET: Secret<string>;
  INTERNAL_TELEGRAM_BOT_KEY: Secret<string>;
  WEBSITE_HOST_NAME: Secret<string>;
  WEBSITE_DOMAIN_NAME: Secret<string>;
};

export const appCryptoSecrets =
  Secret.parseKeyValueFileIntoObjectOfKeySecret<CryptoSecrets>(
    joinRelativeToPackageJson(`secrets/.crypto.${process.env.NODE_ENV}`),
  );
