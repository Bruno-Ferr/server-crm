import { db } from ".";

export const getCollaborators = async () => {
  const collaborators = await db().select().from('colaboradores')

  return collaborators;
}

export const getCollaboratorsWithServices = async () => {
  const collaborators = await db().select().from('colaboradores').leftJoin('services', 'colaboradores.id', 'services.colaborador')

  return collaborators
}



// ############ CREATES

export const createCollaborators = async (collaborator: {}) => {
  await db("colaboradores").insert(collaborator)

  return;
}

export const createCollaborators_services = async (collaboratorServices: any) => {
  await db("colaborador_servicos").insert(collaboratorServices);

  return;
} 