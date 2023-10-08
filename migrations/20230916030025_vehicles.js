/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('veiculos', function (table) {
    table.string('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.string('modelo').notNullable();
    table.string('placa').notNullable();
    table.string('categoria').notNullable();
  }).createTable('veiculo_fotos', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.string('foto').notNullable();
    table.uuid('veiculo_id').references('id').inTable('veiculos').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists('veiculo_fotos')
    .dropTableIfExists('veiculos');
}
