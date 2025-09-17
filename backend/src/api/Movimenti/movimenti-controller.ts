import express, { Request, Response } from "express";
import { eseguiBonifico } from "./movimenti-service"; // il file che ti ho fatto prima
import { BonificoDto } from "../Bonfico/bonifico-dto";

const router = express.Router();

router.post("/bonifico", async (req: Request, res: Response) => {
  try {
    const dto: BonificoDto = req.body;

    // chiama il service passando ip del client
    const result = await eseguiBonifico(dto, req.ip);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Errore durante il bonifico",
    });
  }
});

export default router;