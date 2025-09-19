import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request-interface";
import { AddUserDTO, ConfirmUserDTO, UpdPsswdDTO } from "./auth.dto";
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
      email: req.body.username,
      password: req.body.password,
      dataApertura: new Date()
    }
    const credentialsData = pick(req.body, "username", "password");

    const newUser = await userSrv.add(UserUpd, credentialsData);
    await userSrv.sendMail(credentialsData.username);
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

export const confirm = async (
  req: TypedRequest<ConfirmUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.username;

    await userSrv.confirmMail(email);
    await logOperazione(req.ip, `Conferma apertura Conto Corrente per ${email}`, true);

    res.status(201).json("Apertura Conto Corrente");
  } catch (err) {
      next(err);
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

export const updPssw = async (
  req: TypedRequest<UpdPsswdDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    await userSrv.updatePassword(req.user?.id!, req.body.password);
    await logOperazione(req.ip, `Password aggiornata con successo`, true);

    res.status(201).json("Password Aggiornata");
  } catch (err) {
      next(err);
    
  }
};
