import { db } from ".";


export const getAdminByEmail = async (email: string) => {
  const admin = await db('administradores').select().where('email', email);

  return admin;
}


export const createAdmin = async (admin: any) => {
  await db('administradores').insert(admin);

  return;
}