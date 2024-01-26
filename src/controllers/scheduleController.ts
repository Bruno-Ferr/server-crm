import { Request, Response } from "express";
import { db } from "../database";
import { v4 as uuid } from 'uuid';
import dayjs from "dayjs";
import 'dayjs/locale/pt-br' 
import { getServicesById, getServicesTypeById, getWorkdayByDate } from "../database/service_table";
import { getClientScheduleByCPF, getFreeSchedule, getScheduleArray } from "../database/schedule_table";
import { getClientByCellNumber } from "../database/cliente_table";
import { getVehicleByVeiculo } from "../database/vehicle_table";

const getAvailableSchedule = async (req: Request, res: Response) => { //Corrigir formatação de datas/horários
  const { service, selectedDate } = req.query // selectedDate deve vir em outro formato, ver como converte-lo
  try {
    //converter selectedDate em dia e então número de 0-6
    const selectedDateDay = dayjs(String(selectedDate)).day()
    const referenceDate = dayjs(String(selectedDate))

    //Pega o horário de funcionamento do lava rápido
    const workDays = await getWorkdayByDate(selectedDateDay)
    
    if(workDays.length < 1) {return res.send(`Não trabalhamos na(o) ${dayjs().locale('pt-br').day(selectedDateDay).format('dddd')}`)}
    //Separar horários de abertura e fechamento
    const openAt = workDays[0].abertura_em_minutos;
    const closeAt = workDays[0].fechamento_em_minutos;

    const hora = 60
    const [services] = await getServicesById(service) //Tipo de service??

    const startHour = openAt / 60 // Precisa trocar a conta para o tempo de duração medio do serviço, no caso se o tempo for 1 hora está correto
    const endHour = closeAt / 60 // Precisa trocar a conta para o tempo de duração medio do serviço, no caso se o tempo for 1 hora está correto

    const possibleTimes = Array.from({ length: (endHour - startHour) * (hora / services.duracao)}).map(
      (_, i) => {   
        let hourPercent = (i / (hora / services.duracao))
        let hour = Math.floor(hourPercent)
        let minutes = (hourPercent % 1) * 60 / 100 
        return startHour + hour + minutes
      },
    ) // Cria um array com todas as horas disponíveis

    //Procura todos os agendamentos do SERVIÇO selecionado entre as horas "disponíveis"
    const scheduled = await getFreeSchedule(service, referenceDate, startHour, endHour)

    // scheduled.length > workDays[0].quantidade_por_vez preciso consultar se um tempo específico se repete igual a workDays[0].quantidade_por_vez vezes...
    const availableTimes = possibleTimes.filter((time) => {
      const isTimeBlocked = scheduled.some(
        (scheduled) => console.log()
        //parseInt(scheduled.data.getHours() + "." + scheduled.data.getMinutes()) === time
      )
      const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())
        
      return !isTimeBlocked && !isTimeInPast
    }) // Filtra os horários disponíveis

    return res.json({ possibleTimes, availableTimes })
  } catch (err) {
    return res.json(err.message)
  }
}

const addSchedule = async (req: Request, res: Response) => { //Só pode marcar em horários available, incluindo retirada de datas passadas
  const {service, vehicleId, selectedDate, selectedTime} = req.body;
  const {cellNumber} = req.params;
  try {
    
    // Busca por cpf e id do serviço solicitado
    const [{ cpf }] = await db().select().from("usuarios").where("telefone", cellNumber)
    const [{ id: serviceId }] = await db().select().from("servicos").where("tipo", service)

    //Talvez uma regex para remover tudo que não for número entre o horário
    const date = dayjs(selectedDate).set("hour", selectedTime.substring(0, 2)).set("minute", selectedTime.substring(3)).toDate()

    const selectedDateDay = dayjs(String(selectedDate)).day()
    const workDays = await db('funcionamento').select().where('dia', selectedDateDay).and.where('servicos', serviceId)

    //Confere se ainda há vaga no horário do agendamento
    const scheduled = await db('agendamentos').select()
      .where('servico', serviceId)
      .and
      .where('data', date)

    // Conferir se o veículo e horário são os mesmos (veiculo e serviço também?)
    scheduled.map(schedule => {
      if (schedule.veiculo === vehicleId && String(schedule.data) == String(date)) {
        return res.json('Você já agendou esse veículo para esse horário agendado')
      }
    })

    if (scheduled.length >= workDays[0].quantidade_por_vez) {
      return res.json("Esse horário não está mais disponível")
    }

    const id = uuid() //Pode ser um número, tipo a senha? Todo dia volta para 1...
    const notificação = 15; // 15 minutos, começa com um padrão e ao confirmar, pergunta se ele deseja trocar o tempo da notificação

    await db("agendamentos").insert({cliente: cpf, id, servico: serviceId, veiculo: vehicleId, data: date, status: notificação})

    return res.send('Horário agendado')
  } catch (err) {
    return res.send(err.message)
  }
}

//Como funciona o envio de notificação? 🤔

const getClientSchedule = async (req: Request, res: Response) => { //Possível fazer com filtros? ex: Data específica, após tal data, dentro de hoje...
  const { cellNumber } = req.params;

  const [{ cpf, nome }] = await getClientByCellNumber(cellNumber)

  const schedulesArray = await getClientScheduleByCPF(cpf) 

  const vehicles = schedulesArray.map(async schedule => {
    const vehicleIDs = await getVehicleByVeiculo(schedule.veiculo)
    const [{ tipo: serviceName }] = await getServicesTypeById(schedule.servico)
    const [ car ] = vehicleIDs.map(vehicle => {
      return {...schedule, modelo: vehicle.modelo, placa: vehicle.placa, servico: serviceName }
    })

    return car
  }) 

  const schedule = await Promise.all(vehicles)

  return res.send({nome, schedule})
}

const getDaySchedule = async (req: Request, res: Response) => {
  const { date } = req.query;

  const schedulesArray = await getScheduleArray(date)

  //.leftJoin('agendamento')
  //console.log(schedulesArray)
  return res.send(schedulesArray)
}

export const scheduleController = {
  getAvailableSchedule,
  addSchedule,
  getClientSchedule,
  getDaySchedule
}