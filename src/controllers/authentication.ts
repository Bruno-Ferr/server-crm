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

  const userExists = await getAdminByUsername(auth.email);
  if (userExists === null) throw new Error("User not found.");

  const isSamePassword = bcrypt.compareSync(auth.password, userExists.password);
  if (!isSamePassword) throw new Error("Wrong password.");

  const secret = new TextEncoder().encode("segredo-do-jwt")

  const payload = {
    sub: userExists.id,
    name: userExists.email,
    role: userExists.role,
  }

  const alg = 'HS256'

  const token = await new jwt.SignJWT(payload).setProtectedHeader({ alg }).setExpirationTime("1d").sign(secret)

  userExists.password = "";
  return res.status(200).send({ token, userExists });
}

export async function recoverToken(req: Request, res: Response) {
  const auth = req.headers.authorization

  if(auth) {
    const [, jwtToken] = auth.split(' ');
    const user = await verifyToken(jwtToken)

    return res.status(200).send({user})
  }

  return res.status(400).send({error: 'ops'})
}

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode("segredo-do-jwt");

  const { payload } = await jwt.jwtVerify(token, secret) as any;

  const {name, email, role} = await getAdminByUsername(payload.name);
  return {name, email, role};
}

export const authController = {
  register,
  login,
  verifyToken,
  recoverToken
}