import { Request, Response } from "express";
import { db } from "../database";
import { getCPFByCellNumber, getClientByCPF, getClientByCellNumber, getSameCellNumberDifferentCPFs, updateClientNumberByCPF, updateClientNumberByCellNumber } from "../database/cliente_table";

async function changeClientNumber(cellNumber: string, cpf: string) {
  
}

const createClient = async (req: Request, res: Response) => {
  const { name, cellNumber, logradouro, cidade, estado, numero, cpf } = req.body

  const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const phonePattern = /^\(\d{2}\) (9\d{4}|\d{4})-\d{4}$/;

  if (!cpfPattern.test(cpf)) {
    return res.status(400).send('cpf não é válido');
  } 
  if (phonePattern.test(cellNumber)) {
    return res.status(400).send('Número de celular não é válido');
  }

  const user = {
    nome: name,
    telefone: cellNumber,
    logradouro,
    cidade,
    estado,
    numero,
    cpf
  }

  try {
    await db.insert(user).into("usuarios");
  } catch (err) {
    if(err.code === 'ER_DUP_ENTRY') {
      const [ differentNumber ] = await getClientByCPF(cpf);
      if (differentNumber.telefone !== cellNumber) {
        const exists = await getClientByCellNumber(cellNumber);
        if(exists.length > 0) {
          await updateClientNumberByCellNumber(cellNumber);
        }
        await updateClientNumberByCPF(cellNumber, cpf);
        //verificar se o número já está sendo utilizado
        const [ alreadyClient ] = await getClientByCellNumber(cellNumber);
        return res.send(alreadyClient)
      } else {
        return res.send('O usuário já está cadastrado');
      }
    }
    return res.send(err.message);
  }

  return res.send('Cadastrado!');
}

const getClient = async (req: Request, res: Response) => {
  const {cellNumber} = req.params;

  const client = await getClientByCellNumber(cellNumber);

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
  const client = await getClientByCPF(cpf)
  // Verifica se o número está associado a outro CPF
  if(await getCPFByCellNumber(cellNumber)) {
    const [{ cpf: numberAlreadyUsed = undefined } = {} ] = await getSameCellNumberDifferentCPFs(cellNumber, cpf);

    if(numberAlreadyUsed !== undefined) {
      if (numberAlreadyUsed != cpf) {
        if (client.length > 0) {
          // Remove o número do CPF antigo
          // e adiciona número nesse CPF existente

          await updateClientNumberByCPF('', numberAlreadyUsed);
          const updatedClient = await updateClientNumberByCPF(cellNumber, cpf); 

          return res.send(updatedClient);
        } else {
          // Se não, informa que não tem cadastro e pede a rota de cadastro
          return res.send('Usuário não encontrado!');
        }
      }
    } else {
      await updateClientNumberByCPF(cellNumber, cpf);
    }
  }
  const updatedClient = await getClientByCPF(cpf);
  return res.send(updatedClient);
}

export const clientController = {
  createClient,
  getClient,
  editClient
}