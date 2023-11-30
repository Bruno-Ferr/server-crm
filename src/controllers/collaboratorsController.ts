import { Request, Response } from "express";
import { db } from "../database";
import { v4 as uuid } from 'uuid';

type workDayType = {
  day: number,
  entryTime: number,
  exitTime: number
}

const addCollaborator = async (req: Request, res: Response) => {
  const { name, birthday, first_day, cpf, role, services, work_schedule } = req.body

  try {
    await db.insert({nome: name, data_inicio: first_day, aniversario: birthday, id: cpf, cargo: role}).into("colaboradores")

    const collaboratorServices = services.map((service: string) => ({  
      id: uuid(),
      colaborador: cpf,
      servico: service 
    }))

    await db.insert(collaboratorServices).into("colaborador_servicos")

    const collaboratorSchedule = work_schedule.map((work_day: workDayType) => ({  
      id: uuid(),
      colaborador: cpf,
      dia: work_day.day,
      entrada_em_minutos: work_day.entryTime,
      saida_em_minutos: work_day.exitTime,
    }))

    await db.insert(collaboratorSchedule).into("colaborador_horarios")
  } catch (err) {
    return res.send(err.message)
  }

  return res.send('Colaborador cadastrado!')
}

const getCollaborator = async (req: Request, res: Response) => {

}

const getCollaboratorList = async (req: Request, res: Response) => {
  const collaboratorIds = await db().select().from('colaboradores')
  const collaboratorPromises  = collaboratorIds.map(async (collaborator) => {
    const servicesId = await db().select('servico').from('colaborador_servicos').where('colaborador', collaborator.id)
    const schedule = await db().select().from('colaborador_horarios').where('colaborador', collaborator.id)

    const servicesPromises = servicesId.map(async (serviceId) => {
      const [services] = await db().select('tipo').from('servicos').where('id', serviceId.servico)

      return services
    })

    const services = await Promise.all(servicesPromises);

    return {
      ...collaborator,
      servicos: services,
      horarios: schedule
    }
  })

  const collaborators = await Promise.all(collaboratorPromises);

  if (collaborators.length < 1) {
    return res.send("Não existem serviços cadastrados!")
  }

  return res.send(collaborators)
}

export const collaboratorController = {
  addCollaborator,
  getCollaborator,
  getCollaboratorList
}