import { ContoCorrenteModel } from "../Conto-Corrente/conto-corrente-model";
import { MovimentiModel } from "./movimenti-model";
import { BonificoDto } from "../Bonfico/bonifico-dto";
import { RicaricaDto } from "../Ricarica-dto/ricarica-dto";
import { format } from "@fast-csv/format";
import { Writable } from "stream";
import { addLog } from "../log/log-service";
import  {MovimentiDTO}  from "./movimenti-dto";
import CategorieMovimentiService from '../Categorie-Movimenti/categorie-service';
export const esportaMovimenti = async (movimenti?: any[]): Promise<Buffer> => {
  const data =
    movimenti ?? (await MovimentiModel.find().sort({ data: -1 }).lean());

  return new Promise((resolve, reject) => {
    const bufferChunks: Buffer[] = [];
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        bufferChunks.push(Buffer.from(chunk));
        callback();
      },
    });

    const csvStream = format({ headers: true });
    csvStream
      .pipe(writableStream)
      .on("finish", () => resolve(Buffer.concat(bufferChunks)))
      .on("error", (err) => reject(err));

    data.forEach((row) => csvStream.write(row));
    csvStream.end();
  });
};

export const getUltimiMovimenti = async (n?: number) => {
  const limit = n && !isNaN(n) ? n : 5;
  const movimenti = await MovimentiModel.find({})
  .sort({ dataCreazione: -1 })
  .limit(5)
  .lean(); 

  const saldo = movimenti.reduce((tot, m) => tot + m.importo, 0);

  return { movimenti, saldo };
};

export const getUltimiMovimentiByCategoria = async (n?: number, nomeCategoria?: string) => {
  const limit = n && !isNaN(n) ? n : 5;

  if (!nomeCategoria) throw new Error("Nome categoria non fornito");
  const categoria = await CategorieMovimentiService.getCategoriaByNome(nomeCategoria);

  const movimenti = await MovimentiModel.find({ CategoriaMovimentoid: categoria._id })
    .sort({ dataCreazione: -1 })
    .limit(limit)
    .exec();

  return movimenti;
};
export const getUltimiMovimentiByDateRange = async (
  n?: number,
  dataInizio?: Date,
  dataFine?: Date
) => {
  const limit = n && !isNaN(n) ? n : 5;
  const movimenti = await MovimentiModel.find({
    dataCreazione: { $gte: dataInizio, $lte: dataFine },
  })
    .sort({ dataCreazione: -1 })
    .limit(limit)
    .exec();

  return movimenti;
};
export async function eseguiBonifico(dto: MovimentiDTO, mittenteId: string, ip?: string) {
  try {
    const contoMittente = await ContoCorrenteModel.findById(mittenteId);
    const contoDestinatario = await ContoCorrenteModel.findOne({iban: dto.ContoCorrenteId});
    console.log(contoDestinatario);

    if (!contoMittente || !contoDestinatario) {
      await logOperazione(ip, "Bonifico fallito: IBAN destinatario non valido", false);
      throw new Error("IBAN destinatario non valido");
    }

    const saldoMittente = await getSaldoConto(contoMittente.id);
    if (saldoMittente < dto.importo) {
      await logOperazione(ip, "Bonifico fallito: saldo insufficiente", false);
      throw new Error("Saldo insufficiente");
    }

    await MovimentiModel.create({
      ContoCorrenteId: contoMittente.iban,
      importo: -dto.importo,
      saldo: saldoMittente - dto.importo,
      dataCreazione: new Date(),
      descrizione: `Bonifico in uscita: ${dto.descrizione}`,
      CategoriaMovimentoid: dto.CategoriaMovimentoid,
    });
    const saldoDest = await getSaldoConto(contoDestinatario.id);
    await MovimentiModel.create({
      ContoCorrenteId: contoDestinatario.iban,
      importo: dto.importo,
      saldo: saldoDest + dto.importo,
      dataCreazione: new Date(),
      descrizione: `Bonifico in entrata: ${dto.descrizione}`,
      CategoriaMovimentoid: dto.CategoriaMovimentoid,
    });

    await logOperazione(ip, `Bonifico di ${dto.importo}€ eseguito con successo`, true);
    return { mesxsage: "Bonifico eseguito con successo" };
  } catch (error) {
    await logOperazione(ip, `Errore durante il bonifico: ${error}`, false);
    throw error;
  }
}
export async function getSaldoConto(iban: string): Promise<number> {
  const ultimoMovimento = await MovimentiModel.findOne({ ContoCorrenteId: iban })
    .sort({ dataCreazione: -1 });

  return ultimoMovimento ? ultimoMovimento.saldo : 1000;
}

export async function eseguiRicarica(dto: RicaricaDto, ip?: string) {
  try {
    const conto = await ContoCorrenteModel.findById(dto.ContoCorrenteId);

    if (!conto) {
      await logOperazione(ip, "Ricarica fallita: conto non trovato", false);
      throw new Error("Conto non trovato");
    }

    const saldoDisponibile = await getSaldoConto(conto.id);
    if (saldoDisponibile < dto.importo) {
      await logOperazione(ip, "Ricarica fallita: saldo insufficiente", false);
      throw new Error("Saldo insufficiente");
    }

    await MovimentiModel.create({
      ContoCorrenteId: conto.id,
      dataCreazione: new Date(),
      importo: -dto.importo,
      saldo: saldoDisponibile - dto.importo,
      CategoriaMovimentoid: dto.CategoriaMovimentoid,
      descrizione: `Ricarica ${dto.operatore} numero ${dto.numeroTelefono}`,
    });

    await logOperazione(
      ip,
      `Ricarica eseguita con successo (${dto.importo}€ su ${dto.numeroTelefono})`,
      true
    );

    return { message: "Ricarica eseguita con successo" };
  } catch (error) {
    await logOperazione(ip, `Errore durante la ricarica: ${error}`, false);
    throw error;
  }
}
export async function logOperazione(
  ip: string | undefined,
  descrizione: string,
  successo: boolean
): Promise<void> {
  await addLog({
    ip: ip ?? "unknown",
    dateOperation: new Date(),
    descrizione: `${descrizione} - ${successo ? "Successo" : "Fallimento"}`,
  });
}
