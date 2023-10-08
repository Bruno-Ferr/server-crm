import { Request, Response } from "express";
import { db } from "../database";
import { v4 as uuid } from 'uuid';

// Cliente adiciona fotos do veículo 

const addVehicle = async (req: Request, res: Response) => {
  const {placa, modelo, categoria} = req.body
  const {cellNumber} = req.params

  const vehicleId = placa + modelo

  //Apenas se já não existir inserir no banco de dados
  try {
    await db("veiculos").insert({placa, modelo, categoria, id: vehicleId})
  } catch (error) {}

  //VehicleOwner
  const id = uuid()
  try {
    const [{ cpf }] = await db().select("cpf").from("usuarios").where("telefone", cellNumber)
    const existingRelationship = await db("proprietario_veiculos")
      .where({ proprietario: cpf, veiculo_id: vehicleId })
      .first();

    if (!existingRelationship) {
      await db("proprietario_veiculos").insert({id, proprietario: cpf, veiculo_id: vehicleId})
      return res.send('Veículo cadastrado')
    }
    return res.send('Já possui esse veículo cadastrado')
  } catch (error) {
    return res.send(error.message)
  } 
} 

const addVehiclePhotos = async (req: Request, res: Response) => {
  const { photos, vehicleId } = req.body

  try {
    const photoCount = await db('veiculo_fotos')
      .where('veiculo_id', vehicleId)
      .count('id as count')
      .first();

    const vehiclePhotos = photos.map((photo: string) => ({  
      id: uuid(),
      foto: photo,
      vehicleId
    }))

    if (photoCount && photos > 5) { // Não testado
      return res.status(400).json({ error: 'Não foi possível concluir a ação pois você já possui muitas fotos do veículo.' });
    }
  
    await db("veiculo_fotos").insert(vehiclePhotos)
  } catch (err) {
    return res.send(err.message)
  }
  
  return res.send("Fotos cadastradas")
}

const getClientVehicles = async (req: Request, res: Response) => {
  const {cellNumber} = req.params

  const [{ cpf }] = await db().select("cpf").from("usuarios").where("telefone", cellNumber)
  const veiculos = await db("proprietario_veiculos").select('veiculo_id').where('proprietario', cpf).then(results => {
    const vehicleIds = results.map((row) => row.veiculo_id);

    return db().select().from("veiculos").whereIn("id", vehicleIds)
  })
  if (veiculos.length < 1) {
    return res.send('Você não possui veículos cadastrados')
  }

  return res.send(veiculos)
}

export const vehicleController = {
  addVehicle,
  getClientVehicles
}