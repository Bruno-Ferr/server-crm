import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../controllers/authentication";

export const authorization = (request : Request, response : Response, next : NextFunction) => {
  // Bearer seu-token....
  const token = request.headers.authorization?.replace(/^Bearer /, "");
  if (token == undefined) return response.status(401).send({ message: "Unauthorized: token missing." });

  const user = verifyToken(token);
  if (!user) response.status(404).send({ message: "Unauthorized: invalid token." });
  
  request.body.user = user;
  next();
}