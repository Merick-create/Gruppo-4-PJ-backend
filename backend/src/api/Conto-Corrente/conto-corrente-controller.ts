import { Request,Response,NextFunction } from "express";
import userservice from "./conto-corrente-service";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, credentials } = req.body;
    const newUser = await  userservice.add(user, credentials);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contoId = req.params.id;
    const { updateData, credentials } = req.body;
    const updatedUser = await userservice.update(contoId, updateData, credentials);
    if (!updatedUser) {
       res.status(404).json({ message: "Conto non trovato" });
    }
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contoId = req.params.id;
    await userservice.delete(contoId);
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};