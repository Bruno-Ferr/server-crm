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

export const collaboratorController = {
  addCollaborator,
  getCollaborator
}