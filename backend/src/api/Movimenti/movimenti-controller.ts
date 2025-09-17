import { Request, Response, NextFunction } from 'express';
import { getUltimiMovimenti, esportaMovimenti, getUltimiMovimentiByCategoria, getUltimiMovimentiByDateRange } from './movimenti-service';
import { QueryMovimentiDTO, QueryMovimentiCategoriaDTO, QueryMovimentiDateRangeDTO } from './movimenti-dto';
import { TypedRequest } from '../../lib/typed-request-interface';
import { NotFoundError } from '../../error/not-found-error';


export const RicercaMov1 = async (
  req: TypedRequest<unknown, QueryMovimentiDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { n } = req.query;
    const result = await getUltimiMovimenti(Number(n));

    if (!result.movimenti.length) {
      throw new NotFoundError();
    }

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
    const fileBuffer = await esportaMovimenti();

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
