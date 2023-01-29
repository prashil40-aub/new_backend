/* eslint-disable import/no-import-module-exports */
import mongoose from 'mongoose';
import { envVars } from '@/config';
import { logger } from '@/libs';

// class DBConnection {
//   public static makeNewConnection(uri: string) {
//     const db = mongoose.createConnection(uri, {});

//     db.on('error', (err) => {
//       logger.info(`[1]Mongoose default error: ${err}`);
//     });

//     db.on('connected', () => {
//       logger.info(`[1]Mongoose connection open to ${uri.split('//').pop()}`);
//     });

//     db.on('disconnected', () => {
//       logger.info('[1]Mongoose default connection disconnected');
//     });
//     return db;
//   }
// }

// export default DBConnection;

function makeNewConnection(uri) {
  const db = mongoose.createConnection(uri, {});

  db.on('error', (err) => {
    logger.info(`[1]Mongoose default error: ${err}`);
  });

  db.on('connected', () => {
    logger.info(`[1]Mongoose connection open to ${uri}`);
  });

  db.on('disconnected', () => {
    logger.info('[1]Mongoose default connection disconnected');
  });
  return db;
}

const DB = makeNewConnection(`${envVars.db.url}`);
const prodCloneDB = makeNewConnection(
  `mongodb://${envVars.db.cloneIP}:${envVars.db.clonePORT}/solarPowerEnergy`
);
const productionDB = makeNewConnection(`${envVars.db.PRODUCTION_MONGO_URL}`);

export { DB, prodCloneDB, productionDB };

// module.exports = {
//   DB,
//   prodCloneDB,
// };

// const DB = makeNewConnection(`${envVars.db.url}`);
// const prodCloneDB = makeNewConnection(
//   `mongodb://${envVars.db.cloneIP}:${envVars.db.clonePORT}/solarPowerEnergy`
// );

// module.exports = {
//   DB,
//   prodCloneDB,
// };
