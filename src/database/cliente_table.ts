import { db } from ".";

export const getClientByCellNumber = async (cellNumber: string) => {
  const client = await db('usuarios').select().where('telefone', cellNumber);

  return client;
}

export const getCPFByCellNumber = async (cellNumber: string) => {
  const client = await db('usuarios').select('cpf').where('telefone', cellNumber);

  return client;
}

export const getClientByCPF = async (cpf: string) => {
  const client = await db('usuarios').select().where('cpf', cpf);

  return client;
}

export const getSameCellNumberDifferentCPFs = async (cellNumber: string, cpf: string) => {
  const client = await db('usuarios').select('cpf').where('telefone', cellNumber).and.not.where('cpf', cpf)

  return client;
}


// ############ CREATES

export const createClient = async (user: {}) => {
  const client = await db("usuarios").insert(user)

  return client;
}






// ###################### UPDATES 

export const updateClientNumberByCPF = async (cellNumber: string, cpf: string) => {
  const updated = await db('usuarios').update('telefone', cellNumber).where('cpf', cpf);

  return updated;
}

export const updateClientNumberByCellNumber = async (cellNumber: string) => {
  const updated = await db('usuarios').update('telefone', '').where('telefone', cellNumber);

  return updated;
}