import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../database";

type WorkDayType = {
  day: number;
  openAt: number;
  closeAt: number;
  servico: string;
  quantity: number;
}

function hasDuplicateWorkDays(workSchedule: WorkDayType[]): boolean {
  const seen = new Set();

  for (const workDay of workSchedule) {
    const key = `${workDay.day}-${workDay.servico}`;

    if (seen.has(key)) {
      return true; // Found a duplicate
    }

    seen.add(key);
  }

  return false; // No duplicates found
}

const listServices = async (req: Request, res: Response) => {
  const services = await db().select().from('servicos')

  if (services.length < 1) {
    return res.send("Não existem serviços cadastrados!")
  }

  return res.send(services)
}

const addServices = async (req: Request, res: Response) => {
  const { type, price, duration } = req.body;

  //Formatar o preço, duration chegara em minutos
  const id = uuid()

  //Talvez usar regex apenas com consoantes para evitar erros de digitação
  const existingService = await db("servicos")
      .where("tipo", type)
      .first();

  if (!existingService) {
    await db('servicos').insert({
      id,
      tipo: type,
      preco: price,
      duracao: duration
    })
  } else {
    return res.send('Serviço já adicionado')
  }
  
  return res.send('Serviço adicionado')
}

const addWorkdays = async (req: Request, res: Response) => {
  try {
    const { workSchedule } = req.body;

    // Check for duplicate entries in the workSchedule array
    const hasDuplicates = hasDuplicateWorkDays(workSchedule);

    if (hasDuplicates) {
      return res.status(400).json({ error: 'Duplicate work days found.' });
    }

    // Check for duplicates in the database
    const existingWorkDays = await db('funcionamento')
      .select('dia', 'servicos')
      .whereIn('dia', workSchedule.map((workDay: WorkDayType) => workDay.day))
      .whereIn('servicos', workSchedule.map((workDay: WorkDayType) => workDay.servico));

    if (existingWorkDays.length > 0) {
      return res.status(400).json({ error: 'Duplicate work days found in the database.' });
    }

    const workday = workSchedule.map((workDay: WorkDayType) => ({  
        id: uuid(),
        dia: workDay.day,
        abertura_em_minutos: workDay.openAt,
        fechamento_em_minutos: workDay.closeAt,
        servicos: workDay.servico,
        quantidade_por_vez: workDay.quantity
      }))

    //Talvez precise converter o workDay.openAt e workDay.closeAt para minutos
    await db('funcionamento').insert(workday)
    
    return res.send('Dias e horários de funcionamento do estabelecimento cadastrado!')
  } catch (error) {
    console.error('Error inserting work schedule:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export const serviceController = {
  addServices,
  addWorkdays,
  listServices
}