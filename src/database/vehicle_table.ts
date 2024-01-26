import { db } from ".";

export const getVehicleByVeiculo = async (veiculo) => {
  const schedule = await db("veiculos").select().where('id', veiculo);

  return schedule;
}