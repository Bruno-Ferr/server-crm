/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('colaboradores', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.string('nome').notNullable();
    table.dateTime('aniversario').notNullable();
    table.string('cargo').notNullable();
    table.dateTime('data_inicio').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('colaboradores');
}
