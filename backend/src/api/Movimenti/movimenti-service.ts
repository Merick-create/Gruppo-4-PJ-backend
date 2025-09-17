import { ContoCorrenteModel } from "../Conto-Corrente/conto-corrente-model";
import { MovimentiModel } from "./movimenti-model";
import { BonificoDto } from "../Bonfico/bonifico-dto";
import { RicaricaDto } from "../Ricarica-dto/ricarica-dto";
import { format } from "@fast-csv/format";
import { Writable } from "stream";
import { addLog } from "../log/log-service";
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

export const getUltimiMovimenti = async (n: number) => {
  const movimenti = await MovimentiModel.find()
    .sort({ dataCreazione: -1 })
    .limit(n)
    .exec();

  const saldoAgg = await MovimentiModel.aggregate([
    { $group: { _id: null, saldo: { $sum: "$importo" } } },
  ]);

  const saldo = saldoAgg.length > 0 ? saldoAgg[0].saldo : 0;

  return { movimenti, saldo };
};

export const getUltimiMovimentiByCategoria = async (
  n: number,
  categoria: string
) => {
  const movimenti = await MovimentiModel.find({ nomeCategoria: categoria })
    .sort({ dataCreazione: -1 })
    .limit(n)
    .exec();

  return movimenti;
};

export const getUltimiMovimentiByDateRange = async (
  n: number,
  dataInizio: Date,
  dataFine: Date
) => {
  const movimenti = await MovimentiModel.find({
    dataCreazione: { $gte: dataInizio, $lte: dataFine },
  })
    .sort({ dataCreazione: -1 })
    .limit(n)
    .exec();

  return movimenti;
};
export async function eseguiBonifico(bonificoDto: BonificoDto, ip?: string) {
  try {
    const contoMittente = await ContoCorrenteModel.findOne({
      iban: bonificoDto.ibanMittente,
    });
    const contoDestinatario = await ContoCorrenteModel.findOne({
      iban: bonificoDto.ibanDestinatario,
    });

    if (!contoMittente || !contoDestinatario) {
      await logOperazione(ip, "Bonifico fallito: IBAN non valido", false);
      throw new Error("IBAN non valido");
    }

    const saldoMittente = await getSaldoConto(contoMittente.id);
    if (saldoMittente < bonificoDto.importo) {
      await logOperazione(ip, "Bonifico fallito: saldo insufficiente", false);
      throw new Error("Saldo insufficiente");
    }

    await MovimentiModel.create({
      ContoCorrenteId: contoMittente.id,
      importo: -bonificoDto.importo,
      dataCreazione: new Date(),
      descrizione: `Bonifico in uscita: ${bonificoDto.descrizione}`,
      saldo: saldoMittente - bonificoDto.importo,
    });

    const saldoDestinatario = await getSaldoConto(contoDestinatario.id);
    await MovimentiModel.create({
      ContoCorrenteId: contoDestinatario.id,
      importo: bonificoDto.importo,
      dataCreazione: new Date(),
      descrizione: `Bonifico in entrata: ${bonificoDto.descrizione}`,
      saldo: saldoDestinatario + bonificoDto.importo,
    });

    await logOperazione(ip, "Bonifico eseguito con successo", true);
    return { message: "Bonifico eseguito con successo" };
  } catch (error) {
    await logOperazione(ip, `Errore durante il bonifico: ${error}`, false);
    throw error;
  }
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
      importo: -dto.importo,
      dataCreazione: new Date(),
      descrizione: `Ricarica ${dto.operatore} numero ${dto.numeroTelefono}`,
      saldo: saldoDisponibile - dto.importo,
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
export async function getSaldoConto(contoId: string): Promise<number> {
  const ultimoMovimento = await MovimentiModel.findOne({
    ContoCorrenteId: contoId,
  }).sort({ dataCreazione: -1 });

  return ultimoMovimento ? ultimoMovimento.saldo : 0;
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
