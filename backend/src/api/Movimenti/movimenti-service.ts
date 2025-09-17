import { CategorieMovimentiModel } from './movimenti-model';
import { Parser } from 'json2csv';

export const getUltimiMovimenti = async (n: number) => {
  const movimenti = await CategorieMovimentiModel.find()
    .sort({ data: -1 })
    .limit(n)
    .exec();

  const saldoAgg = await CategorieMovimentiModel.aggregate([
    { $group: { _id: null, saldo: { $sum: '$importo' } } }
  ]);

  const saldo = saldoAgg.length > 0 ? saldoAgg[0].saldo : 0;

  return { movimenti, saldo };
};

export const getUltimiMovimentiByCategoria = async (n: number, categoria: string) => {
  const movimenti = await CategorieMovimentiModel.find({ nomeCategoria: categoria })
    .sort({ data: -1 })
    .limit(n)
    .exec();

  return movimenti;
};

export const getUltimiMovimentiByDateRange = async (
  n: number,
  dataInizio: Date,
  dataFine: Date
) => {
  const movimenti = await CategorieMovimentiModel.find({
    data: { $gte: dataInizio, $lte: dataFine }
  })
    .sort({ data: -1 })
    .limit(n)
    .exec();

  return movimenti;
};

export const esportaMovimenti = async (movimenti?: any[]) => {
  const data = movimenti ?? (await CategorieMovimentiModel.find().sort({ data: -1 }).lean());

  const parser = new Parser({ fields: ['data', 'importo', 'nomeCategoria'] });
  const csv = parser.parse(data);

  return Buffer.from(csv, 'utf-8');
};

