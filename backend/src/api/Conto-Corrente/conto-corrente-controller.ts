import { Request,Response,NextFunction } from "express";
import userservice from "./conto-corrente-service";
import UserService from './conto-corrente-service';
import { NotFoundError } from '../../error/not-found-error';

// Recupera tutto il profilo dell'utente
export const getFullProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const profile = await UserService.getFullProfile(userId);

    if (!profile) {
      throw new NotFoundError();
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

// Recupera solo l'email
export const getEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const email = await UserService.getEmail(userId);

    if (!email) {
      throw new NotFoundError();
    }

    res.status(200).json({ email });
  } catch (err) {
    next(err);
  }
};

// Recupera solo il nome
export const getNome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const nome = await UserService.getNome(userId);

    if (!nome) {
      throw new NotFoundError();
    }

    res.status(200).json({ nome });
  } catch (err) {
    next(err);
  }
};

// Recupera solo il cognome
export const getCognome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const cognome = await UserService.getCognome(userId);

    if (!cognome) {
      throw new NotFoundError();
    }

    res.status(200).json({ cognome });
  } catch (err) {
    next(err);
  }
};

// Recupera data di apertura
export const getDataApertura = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const dataApertura = await UserService.getDataApertura(userId);

    if (!dataApertura) {
      throw new NotFoundError();
    }

    res.status(200).json({ dataApertura });
  } catch (err) {
    next(err);
  }
};

// Recupera IBAN
export const getIBAN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const iban = await UserService.getIBAN(userId);

    if (!iban) {
      throw new NotFoundError();
    }

    res.status(200).json({ iban });
  } catch (err) {
    next(err);
  }
};
