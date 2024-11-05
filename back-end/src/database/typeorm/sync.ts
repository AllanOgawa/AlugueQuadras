import 'dotenv/config'; 
import { DataSource } from 'typeorm';
import { entities } from '../entities';  

export const DataSourceSync = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: entities,
  migrations: ['src/database/typeorm/migrations/*.ts'],
  synchronize: false
});

DataSourceSync.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
