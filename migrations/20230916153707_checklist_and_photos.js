/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('checklist', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.text('descricao').notNullable();
    table.string('foto').notNullable();
    table.uuid('os_id').references('id').inTable('ordem_servico').notNullable();
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('checklist');
}
