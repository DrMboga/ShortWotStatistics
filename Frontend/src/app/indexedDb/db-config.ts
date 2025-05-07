import { DBConfig } from 'ngx-indexed-db';

export const WG_ACCOUNT_AUTH_COLLECTION_NAME = 'wgAccountAuth';
export const WOT_PLAYER_HISTORY_COLLECTION_NAME = 'wotPlayerHistory';
export const BLITZ_PLAYER_HISTORY_COLLECTION_NAME = 'blitzPlayerHistory';

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

const playerHistorySchema = [
  { name: 'accountId', keypath: 'accountId', options: { unique: false } },
  { name: 'lastBattle', keypath: 'lastBattle', options: { unique: true } },
  { name: 'gold', keypath: 'gold', options: { unique: false } },
  { name: 'freeXp', keypath: 'freeXp', options: { unique: false } },
  { name: 'credits', keypath: 'credits', options: { unique: false } },
  { name: 'battles', keypath: 'battles', options: { unique: false } },
  { name: 'winRate', keypath: 'winRate', options: { unique: false } },
  { name: 'damage', keypath: 'damage', options: { unique: false } },
  { name: 'xp', keypath: 'xp', options: { unique: false } },
  { name: 'survival', keypath: 'survival', options: { unique: false } },
  { name: 'battleLifeTime', keypath: 'battleLifeTime', options: { unique: false } },
];

const wotPlayerHistorySchema = {
  store: WOT_PLAYER_HISTORY_COLLECTION_NAME,
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: playerHistorySchema,
};

const blitzPlayerHistorySchema = {
  store: BLITZ_PLAYER_HISTORY_COLLECTION_NAME,
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: playerHistorySchema,
};

export const dbConfig: DBConfig = {
  name: 'WotStatistics',
  version: 1,
  objectStoresMeta: [accountTokenMeta, wotPlayerHistorySchema, blitzPlayerHistorySchema],
};
