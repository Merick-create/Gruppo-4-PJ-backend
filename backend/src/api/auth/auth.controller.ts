import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request-interface";
import { AddUserDTO } from "./auth.dto";
import userSrv, {
  UserExistsError,
} from "../Conto-Corrente/conto-corrente-service";
import { omit, pick } from "lodash";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";
import { logOperazione } from "../Movimenti/movimenti-service";

const TOKEN_DUR = "1 hour";

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = omit(req.body, "username", "password");
    const UserUpd ={
      ...userData,
      dataApertura: new Date()
    }
    const credentialsData = pick(req.body, "username", "password");

    const newUser = await userSrv.add(UserUpd, credentialsData);
    await logOperazione(req.ip, `Registrazione effettuata correttamente per ${credentialsData.username}`, true);

    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400);
      res.json({
        error: err.name,
        message: err.message,
      });
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        res.status(400);
        res.json({
          error: "LoginError",
          message: info.message,
        });
        return;
      }
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_DUR });
      await logOperazione(req.ip, `${user.cognomeTitolare} ${user.nomeTitolare} ha effettuato il login dal portale`, true);
      res.status(200);
      res.json({
        user,
        token,
      });
    }
  )(req, res, next);
};
