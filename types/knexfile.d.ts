// knexfile.d.ts

declare module '../../knexfile.js' {
  const development: {
    client: string;
    connection: {
      database: string;
      user: string;
      password: string;
    };
    migrations: {
      tableName: string;
    };
  };

  const production: {
    client: string;
    connection: {
      database: string;
      user: string;
      password: string;
    };
    pool: {
      min: number;
      max: number;
    };
    migrations: {
      tableName: string;
    };
  };

  export { development, production };
}
