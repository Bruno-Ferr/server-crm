/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTableIfNotExists('funcionamento', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.integer('dia').notNullable();
    table.integer('abertura_em_minutos').notNullable();
    table.integer('fechamento_em_minutos').notNullable();
    table.integer('quantidade_por_vez').notNullable();
    table.uuid('servicos').references('id').inTable('servicos').notNullable();
  }).createTable('colaborador_horarios', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.uuid('colaborador').references('id').inTable('colaboradores').notNullable();
    table.integer('dia').notNullable();
    table.integer('entrada_em_minutos').notNullable();
    table.integer('saida_em_minutos').notNullable();
  }).createTable('colaborador_servicos', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.uuid('colaborador').references('id').inTable('colaboradores').notNullable();
    table.uuid('servico').references('id').inTable('servicos').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists('funcionamento')
    .dropTableIfExists('colaborador_servicos')
    .dropTableIfExists('colaborador_horarios');

}
