import { db } from ".";


export const getAdminByUsername = async (username: string) => {
  const [admin] = await db('administradores').select().where('email', username);

  return admin;
}


export const createAdmin = async (admin: any) => {
  await db('administradores').insert(admin);

  return;
}