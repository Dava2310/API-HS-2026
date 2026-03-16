export default () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return {
      database: {
        type: 'postgres' as const,
        url: databaseUrl.trim(),
      },
    };
  }

  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const username = process.env.POSTGRES_USER || 'api';
  const password = process.env.POSTGRES_PASSWORD || 'api_secret';
  const database = process.env.POSTGRES_DB || 'api_db';

  return {
    database: {
      type: 'postgres' as const,
      host,
      port,
      username,
      password,
      database,
    },
  };
};
