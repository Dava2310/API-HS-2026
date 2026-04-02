import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl.trim(),
        entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
        migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
      }
    : {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USER || 'api',
        password: process.env.POSTGRES_PASSWORD || 'api_secret',
        database: process.env.POSTGRES_DB || 'api_db',
        entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
        migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
      },
);
