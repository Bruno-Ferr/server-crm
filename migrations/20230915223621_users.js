/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('usuarios', function (table) {
    table.string('cpf').notNullable().unique().primary();
    table.string('nome').notNullable();
    table.timestamp('nascimento');
    table.string('telefone');
    table.string('endereco');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('usuarios');
}
