import dayjs from "dayjs";
import { db } from ".";

export const getFreeSchedule = async (service, referenceDate, startHour, endHour) => {
  const services = await db('agendamentos').select()
    .where('servico', service)
    .and
    .whereBetween('data', [referenceDate.set('hour', startHour).toDate(), referenceDate.set('hour', endHour).toDate()])

  return services;
}

export const getClientScheduleByCPF = async (cpf) => {
  const schedule = await db("agendamentos").select().where('cliente', cpf);

  return schedule;
}

export const getScheduleArray = async (date) => {
  const scheduleArray = await db("agendamentos as a")
    .select('a.id AS agendamento_id', 'a.data AS agendamento_data', 'clt.nome AS agendamento_cliente', 'vclo.placa AS agendamento_veiculo_placa', 'vclo.modelo AS agendamento_veiculo', 'srvc.tipo AS agendamento_servico', 'a.status AS agendamento_notificacao', 'o.*', 'c.*')
    .whereBetween('data', [dayjs(String(date)).set('hour', 0).toDate(), dayjs(String(date)).set('hour', 23).toDate()])
    .join('usuarios as clt', 'a.cliente', 'clt.cpf')
    .join('veiculos as vclo', 'a.veiculo', 'vclo.id')
    .join('servicos as srvc', 'a.servico', 'srvc.id')
    .leftJoin('ordem_servico as o', 'a.id', 'o.agendamento')
    .leftJoin('checklist as c', 'o.id', 'c.os_id');

  return scheduleArray;
}