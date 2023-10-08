/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('servicos', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.string('tipo').notNullable();
    table.decimal('preco', 10, 2).notNullable();
    table.integer('duracao').notNullable();
  }).createTable('agendamentos', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.dateTime('data').notNullable();
    table.string('cliente').notNullable().references('cpf').inTable('usuarios');
    table.string('veiculo').notNullable().references('id').inTable('veiculos');
    table.uuid('servico').notNullable().references('id').inTable('servicos');
    table.string('status');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists('agendamentos')
    .dropTableIfExists('servicos');
}
