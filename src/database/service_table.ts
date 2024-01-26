import { db } from "."

export const getServicesByCollab = async (collabId) => {
  const services = await db().select('servico').from('colaborador_servicos').where('colaborador', collabId)

  return services;
}

export const getAllServices = async () => {
  const services = await db().select().from('servicos')

  return services;
}

export const getServicesByType = async (type: string) => { 
  const service = await db("servicos").where("tipo", type).first();

  return service;
}

export const getServicesById = async (id: any) => { 
  const service = await db("servicos").select().where("id", id);

  return service;
}

export const getServicesTypeById = async (id: any) => { 
  const service = await db("servicos").select("tipo").where("id", id);

  return service;
}


export const getWorkdaysServices = async () => {
  const workdays = await db('funcionamento as f').select('f.*', 's.tipo').leftJoin('servicos as s', 'f.servicos', 's.id');

  return workdays;
}

export const getWorkdayByDate = async (selectedDateDay) => {
  const workday = await db('funcionamento').select().where('dia', selectedDateDay);

  return workday;
}


export const createNewService = async (service: {}) => { 
  const newService = await db('servicos').insert(service);

  return newService;
}

export const createNewWorkday = async (workday: {}) => { 
  const newWorkday = await db('funcionamento').insert(workday);

  return newWorkday;
}

export const deleteWorkday = async () => { 
  await db('funcionamento').del()
}