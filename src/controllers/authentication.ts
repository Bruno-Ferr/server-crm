import bcrypt from 'bcrypt'
import { createAdmin, getAdminByUsername } from '../database/auth_table';
import { Request, Response } from 'express';
import * as jwt from 'jose';

export const register = async (req: Request, res: Response) => {
    const auth = req.body

    const userExists = await getAdminByUsername(auth.email); //get collaborator or admin inside db
    if (userExists.length > 0) throw new Error("This email was already used by another user.");       

    const admin = {
      ...auth,
      password: await bcrypt.hash(auth.password, 1)
    }
    
    console.log(admin)
    await createAdmin(admin) //database auth table
    
    return res.status(201).send({ message: 'conta cadastrada com sucesso!' })
}

export const login = async (req: Request, res: Response) => {
  const auth = req.body;

  const [userExists] = await getAdminByUsername(auth.email);
  if (userExists === null) throw new Error("User not found.");


  const isSamePassword = bcrypt.compareSync(auth.password, userExists.password);
  if (!isSamePassword) throw new Error("Wrong password.");

  const secret = new TextEncoder().encode("segredo-do-jwt")

  const token = new jwt.SignJWT({ id: userExists.id, email: userExists.email }).setExpirationTime("1d");

  userExists.password = "";
  return res.status(200).send({ token, userExists });
}

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode("segredo-do-jwt");

  const { payload } = jwt.jwtVerify(token, secret) as any;
  const user = await getAdminByEmail(payload.email);
  return user;
}

export const authController = {
  register,
  login,
  verifyToken
}