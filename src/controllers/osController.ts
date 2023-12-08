import { Request, Response } from "express";
import { db } from "../database";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

type serviceType = {
  service: string,
  instrucoes_especiais: string
}

const createOS = async (req: Request, res: Response) => { 
  const {services, client, vehicle, arrived} = req.body;
  const { scheduleId } = req.params //Precisa pegar os agendamentos de user... ou user e veiculo
  
  const id = uuid()

  const startOfDay = dayjs(arrived).startOf('day').toJSON()
  const endOfDay = dayjs(arrived).endOf('day').toJSON()

  // const existingVehicleOS = await db('ordem_servico') //Verificar apenas no dia específico, não está 100% acredito
  //     .select()
  //     .where('veiculo', vehicle)
  //     .whereBetween('chegada', [startOfDay, endOfDay])
      
  // const existingServiceOrder = await db('servicos_os')
  //   .whereIn('ordem_servico', existingVehicleOS.map((vehicleOS) => vehicleOS.id))
  //   .whereIn('servico', services.map((service: serviceType) => service.service));

  // if (existingServiceOrder.length > 0) {
  //   const existingServiceOrderChecklist = await db('checklist')
  //     .whereIn('os_id', existingServiceOrder.map((serviceOrder) => serviceOrder.ordem_servico))
  //   return res.status(400).json({ error: 'Duplicate OS found in the database.', OS: [existingVehicleOS, existingServiceOrder, existingServiceOrderChecklist] });
  // }
  
  const existingOS = await db('ordem_servico')
    .where('agendamento', scheduleId)

  if(existingOS.length > 0) {
    return res.status(400).json({ error: 'OS for this schedule already exists.'});
  }

  await db('ordem_servico').insert({id, cliente: client, veiculo: vehicle, chegada: new Date(arrived), agendamento: scheduleId})

  const services_os = services.map((service: serviceType) => ({  
    id: uuid(),
    ordem_servico: id,
    servico: service.service,
    instrucoes_especiais: service.instrucoes_especiais
  }))

  await db('servicos_os').insert(services_os)

  return res.send('OS criada')
}

const updateOS = async (req: Request, res: Response) => {
  const edit = req.query;
  const id = req.params.id;

  const keys = Object.keys(edit)
  const values = Object.values(edit)

  const updateObject = {};
  keys.forEach((key, index) => {
    updateObject[key] = values[index];
  });
  
  try {
    await db('ordem_servico').where({ id }).update(updateObject)
  } catch (err) {
    return res.send(err.message)
  }

  return res.send('editado')
}

const getOS = async (req: Request, res: Response) => {
  const { schedule } = req.params;

  const [OS] = await db('ordem_servico').select().where('agendamento', schedule)
  const checklist = await db('checklist').select().where('os_id', OS.id)

  return res.send([OS, checklist])
}

type checklistPropsType = {
  description: string,
  photo: string
}

const createChecklist = async (req: Request, res: Response) => {
  const {osId, checklistProps} = req.body;

  // 1 descrição por checklist ou descrição para cada foto do checklist?
  try {
    const checklistPhotos = checklistProps.map((checklistProp: checklistPropsType) => ({  
      id: uuid(),
      descricao: checklistProp.description,
      foto: checklistProp.photo,
      os_id: osId
    }))

    await db.insert(checklistPhotos).into("checklist")

  } catch (err) {
    return res.send(err.message)
  }

  return res.send('checklist criado')
}

export const osController = {
  createOS,
  updateOS,
  getOS,
  createChecklist
}