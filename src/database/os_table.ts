import { db } from "."

export const getOSDB = async (date) => {
  const service_order = await db('ordem_servico').select().where('agendamento', date)
  .join('usuarios as cliente', 'cliente', 'cpf')
  .join('veiculos as veiculo', 'veiculo', 'id')
  .join('servicos as servico', 'servico', 'id')

  return service_order
}