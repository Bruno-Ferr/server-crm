// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: "mysql2",
  connection: {
    database: "crm",
    user: "root",
    password: "eD*7pL#w"
  },
  migrations: {
    tableName: "knex_migrations"
  }
};
export const production = {
  client: "mysql2",
  connection: {
    database: "crm",
    user: process.env.USER,
    password: process.env.DATABASE_PASSWORD
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
};
