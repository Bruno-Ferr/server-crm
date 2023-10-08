import { Request, Response } from "express";
import { db } from "../database";

async function changeClientNumber(cellNumber: string, cpf: string) {
  
}

const createClient = async (req: Request, res: Response) => {
  const { name, cellNumber, address, cpf } = req.body

  try {
    await db.insert({nome: name, telefone: cellNumber, endereco: address, cpf}).into("usuarios")
  } catch (err) {
    if(err.code === 'ER_DUP_ENTRY') {
      const [ differentNumber ] = await db().select().from('usuarios').where('cpf', cpf)
      if (differentNumber.telefone !== cellNumber) {
        await db('usuarios').update('telefone', cellNumber).where('cpf', cpf)
        const [ alreadyClient ] = await db().select().from('usuarios').where('telefone', cellNumber)
        return res.send(alreadyClient)
      } else {
        return res.send('O usuário já está cadastrado')
      }
    }
    return res.send(err.message)
  }

  return res.send('Cadastrado!')
}

const getClient = async (req: Request, res: Response) => {
  const {cellNumber} = req.params;

  const client = await db().select().from('usuarios').where('telefone', cellNumber)

  if (client.length > 0) {
    return res.send(client)
  } else {
    return res.send('Cliente não encontrado')
  }
}

const editClient = async (req: Request, res: Response) => { // Ainda não feita
  const { cellNumber } = req.params;
  const { cpf } = req.body;

  // Verifica se existe no BD
  const client = await db().select().from('usuarios').where('cpf', cpf)
  // Verifica se o número está associado a outro CPF
  if(await db().select('cpf').from('usuarios').where('telefone', cellNumber)) {
    const [{ cpf: numberAlreadyUsed = undefined } = {} ] = await db().select('cpf').from('usuarios').where('telefone', cellNumber).and.not.where('cpf', cpf)

    if(numberAlreadyUsed !== undefined) {
      if (numberAlreadyUsed != cpf) {
        if (client.length > 0) {
          // Remove o número do CPF antigo
          // e adiciona número nesse CPF existente

          await db('usuarios').update('telefone', '').where('cpf', numberAlreadyUsed)
          const updatedClient = await db('usuarios').update('telefone', cellNumber).where('cpf', cpf)

          return res.send(updatedClient)
        } else {
          // Se não, informa que não tem cadastro e pede a rota de cadastro
          return res.send('Usuário não encontrado!')
        }
      }
    } else {
      await db('usuarios').update('telefone', cellNumber).where('cpf', cpf)
    }
  }
  const updatedClient = await db().select().from('usuarios').where('cpf', cpf)
  return res.send(updatedClient)
}

export const clientController = {
  createClient,
  getClient,
  editClient
}