import { DBConfig } from 'ngx-indexed-db';

export const WG_ACCOUNT_AUTH_COLLECTION_NAME = 'wgAccountAuth';

const accountTokenMeta = {
  store: WG_ACCOUNT_AUTH_COLLECTION_NAME,
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: [
    { name: 'applicationId', keypath: 'applicationId', options: { unique: true } },
    { name: 'accountId', keypath: 'accountId', options: { unique: true } },
    { name: 'nickname', keypath: 'nickname', options: { unique: true } },
    { name: 'accessToken', keypath: 'accessToken', options: { unique: true } },
    { name: 'expires', keypath: 'expires', options: { unique: true } },
    { name: 'games', keypath: 'games', options: { unique: true } },
  ],
};

export const dbConfig: DBConfig = {
  name: 'WotStatistics',
  version: 1,
  objectStoresMeta: [accountTokenMeta],
};
