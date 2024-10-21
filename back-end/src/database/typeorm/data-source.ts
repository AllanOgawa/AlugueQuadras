import 'dotenv/config'; 
import { DataSource } from 'typeorm';
import { entities } from '../entities';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `env/${env}.env`);
dotenv.config({ path: envFilePath });
console.log(`Carregando variáveis de ambiente de: ${envFilePath}`);

export const DataSourceSync = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: entities,
  migrations: [path.resolve(__dirname, './migrations/*.ts')],
  synchronize: false
});

DataSourceSync.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
