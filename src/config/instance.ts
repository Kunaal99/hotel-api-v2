import { Sequelize } from 'sequelize';
import { config } from './db';

export const sequelize = new Sequelize(
  config?.database?.database,
  config?.database?.user,
  config?.database?.password,
  {
    host: config?.database.host,
    dialect: 'mysql',
    logging: false,
    port: 3306
  }
);