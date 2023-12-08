import { Request, Response } from "express";
import { db } from "../database";
import { v4 as uuid } from 'uuid';

type workDayType = {
  day: number,
  entryTime: number,
  exitTime: number
}

const addCollaborator = async (req: Request, res: Response) => {
  const { name, birthday, firstDay, cpf, role, services} = req.body.data
  
  try {
    await db("colaboradores").insert({nome: name, data_inicio: firstDay, aniversario: birthday, id: cpf, cargo: role})

    const collaboratorServices = services.map((service: string) => ({  
      id: uuid(),
      colaborador: cpf,
      servico: service 
    }))

    await db("colaborador_servicos").insert(collaboratorServices)
  } catch (err) {
    console.log(err)
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

    const servicesPromises = servicesId.map(async (serviceId) => {
      const [services] = await db().select('tipo').from('servicos').where('id', serviceId.servico)

      return services
    })

    const services = await Promise.all(servicesPromises);

    return {
      ...collaborator,
      servicos: services
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