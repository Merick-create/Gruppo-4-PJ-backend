import { Request, Response, NextFunction } from 'express';
import { getUltimiMovimenti, esportaMovimenti, getUltimiMovimentiByCategoria, getUltimiMovimentiByDateRange, getSaldoConto } from './movimenti-service';
import { QueryMovimentiDTO, QueryMovimentiCategoriaDTO, QueryMovimentiDateRangeDTO } from './movimenti-dto';
import { TypedRequest } from '../../lib/typed-request-interface';
import { NotFoundError } from '../../error/not-found-error';
import { eseguiBonifico, eseguiRicarica } from "./movimenti-service"; 
import { BonificoDto } from "../Bonfico/bonifico-dto";
import { RicaricaDto } from "../Ricarica-dto/ricarica-dto";


export const RicercaMov1 = async (req, res, next) => {
  try {
    const { n } = req.query;
    const us=req.user.id;
    const result = await getUltimiMovimenti(Number(n),us);

    if (!result.movimenti.length) throw new NotFoundError();

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const RicercaMov2 = async (
  req: TypedRequest<unknown, QueryMovimentiCategoriaDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { n, categoria } = req.query;
    const result = await getUltimiMovimentiByCategoria(Number(n), categoria);

    if (!result.length) {
      throw new NotFoundError();
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const RicercaMov3 = async (
  req: TypedRequest<unknown, QueryMovimentiDateRangeDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { n, dataInizio, dataFine } = req.query;

    const result = await getUltimiMovimentiByDateRange(
      Number(n),
      new Date(dataInizio),
      new Date(dataFine)
    );

    if (!result.length) {
      throw new NotFoundError();
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const exportMovimenti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileBuffer = await esportaMovimenti(req.user?.id);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=movimenti.csv'
    );
    res.setHeader('Content-Type', 'text/csv');

    res.send(fileBuffer);
  } catch (err) {
    next(err);
  }
};


export const bonifico= async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    const mittenteId = req.user?.id;
    console.log(req.user?.id);

    const result = await eseguiBonifico(dto, mittenteId!, req.ip);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Errore durante il bonifico" });
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

export const getSaldo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { iban } = req.params;
    if (!iban) res.status(400).json({ message: 'IBAN mancante' });

    const saldo = await getSaldoConto(iban);

    res.json({ saldo });
  } catch (error) {
    console.error('Errore getSaldo:', error);
    next(error);
  }
};

