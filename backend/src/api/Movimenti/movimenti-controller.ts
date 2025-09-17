import express, { Request, Response } from "express";
import { eseguiBonifico, eseguiRicarica } from "./movimenti-service"; 
import { BonificoDto } from "../Bonfico/bonifico-dto";
import { RicaricaDto } from "../Ricarica-dto/ricarica-dto";


export const bonifico= async (req: Request, res: Response) => {
  try {
    const dto: BonificoDto = req.body;

    const result = await eseguiBonifico(dto, req.ip);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Errore durante il bonifico",
    });
  }
};

export const ricarica= async (req: Request, res: Response) => {
  try {
    const dto: RicaricaDto = req.body;

    const result = await eseguiRicarica(dto, req.ip);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Errore ricarica" });
  }
};