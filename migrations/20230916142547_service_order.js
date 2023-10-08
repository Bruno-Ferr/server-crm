/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('ordem_servico', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.string('cliente').notNullable().references('cpf').inTable('usuarios');
    table.uuid('veiculo').notNullable().references('id').inTable('veiculos');
    table.uuid('agendamento').notNullable().references('id').inTable('agendamentos');
    table.timestamp('chegada');
    table.timestamp('inicio');
    table.timestamp('conclusao');
    table.boolean('pagamento').defaultTo(0).notNullable();
    table.timestamp('retirada');
    table.timestamp('prazo_entrega');
    table.string('status');
    table.integer('avaliacao');
  }).createTable("servicos_os", function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.uuid('ordem_servico').notNullable().references('id').inTable('ordem_servico');
    table.uuid('servico').notNullable().references('id').inTable('servicos');
    table.text('instrucoes_especiais');
  });
}
 
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('servicos_os')
                    .dropTableIfExists('ordem_servico');
}
