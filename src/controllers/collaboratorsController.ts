import { Request, Response } from "express";
import { db } from "../database";
import { v4 as uuid } from 'uuid';
import { createCollaborators, createCollaborators_services, getCollaborators, getCollaboratorsWithServices } from "../database/collaborators_table";
import { getServicesByCollab } from "../database/service_table";

type workDayType = {
  day: number,
  entryTime: number,
  exitTime: number
}

const addCollaborator = async (req: Request, res: Response) => {
  const { name, birthday, firstDay, cpf, role, services} = req.body.data
  const collab = {nome: name, data_inicio: firstDay, aniversario: birthday, id: cpf, cargo: role}
  try {
    await createCollaborators(collab);

    const collaboratorServices = services.map((service: string) => ({  
      id: uuid(),
      colaborador: cpf,
      servico: service 
    }))

    await createCollaborators_services(collaboratorServices)
  } catch (err) {
    console.log(err)
    return res.send(err.message)
  }

  return res.send('Colaborador cadastrado!')
}

const getCollaborator = async (req: Request, res: Response) => {

}

const getCollaboratorList = async (req: Request, res: Response) => {
  //const collaboratorIds = await getCollaborators()
  // const collaboratorPromises  = collaboratorIds.map(async (collaborator) => {
    // const servicesId = await getServicesByCollab(collaborator.id) //Trocar para chamadas com join?

    // const servicesPromises = servicesId.map(async (serviceId) => {
    //   const [services] = await db().select('tipo').from('servicos').where('id', serviceId.servico)

    //   return services
    // })

  //   const services = await Promise.all(servicesPromises);

  //   return {
  //     ...collaborator,
  //     servicos: services
  //   }
  // })

  const collaboratorPromises = await getCollaboratorsWithServices()

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