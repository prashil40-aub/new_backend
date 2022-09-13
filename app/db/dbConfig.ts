import { envVars } from '@/config';

const {
  // dialect: DB_DIALECT,
  // host: DB_HOST,
  // name: DB_NAME,
  // password: DB_PASSWORD,
  // port,
  // user: DB_USER,
  url: DB_URL,
} = envVars.db;

// const DB_PORT = port ? parseInt(`${port}`, 10) : undefined;
const DB_PORT = 27017;

export function getDBCredentials() {
  // if (!DB_NAME) {
  //   throw new Error('Database name not found');
  // }

  // if (!DB_USER) {
  //   throw new Error('Database user not found');
  // }

  // if (!DB_PASSWORD) {
  //   throw new Error('Database password not found');
  // }

  // if (!DB_HOST) {
  //   throw new Error('Database host not found');
  // }

  // if (!DB_PORT) {
  //   throw new Error('Database port not found');
  // }

  // if (!DB_DIALECT) {
  //   throw new Error('Dialect not found');
  // }

  return {
    // DB_NAME,
    // DB_DIALECT,
    // DB_USER,
    // DB_PASSWORD,
    // DB_HOST,
    DB_PORT,
    DB_URL,
  };
}
