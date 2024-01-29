/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('administradores', function (table) {
    table.string('email').notNullable().unique().primary();
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('role').notNullable();
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('administradores');
}
