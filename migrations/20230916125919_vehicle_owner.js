/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('proprietario_veiculos', function (table) {
    table.uuid('id').defaultTo(knex.fn.uuid()).notNullable().unique().primary();
    table.string('proprietario').notNullable();
    table.uuid('veiculo_id').notNullable();
    table.foreign('proprietario').references('cpf').inTable('usuarios');
    table.foreign('veiculo_id').references('id').inTable('veiculos');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('proprietario_veiculos');
}
