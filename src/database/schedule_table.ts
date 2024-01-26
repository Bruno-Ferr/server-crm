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
    .select('a.id AS agendamento_id', 'a.data AS agendamento_data', 'a.cliente AS agendamento_cliente', 'a.veiculo AS agendamento_veiculo', 'a.servico AS agendamento_servico', 'a.status AS agendamento_notificacao', 'o.*', 'c.*')
    .whereBetween('data', [dayjs(String(date)).set('hour', 0).toDate(), dayjs(String(date)).set('hour', 23).toDate()])
    .leftJoin('ordem_servico as o', 'a.id', 'o.agendamento')
    .leftJoin('checklist as c', 'o.id', 'c.os_id');

  return scheduleArray;
}