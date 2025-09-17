import { ContoCorrenteModel } from "../Conto-Corrente/conto-corrente-model";
import { MovimentiModel } from "./movimenti-model";
import { LogModel } from "../log/log-model";
import { BonificoDto } from "../Bonfico/bonifico-dto";
import { RicaricaDto } from "../Ricarica-dto/ricarica-dto";

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
  await LogModel.create({
    ip: ip ?? "unknown",
    dateOperation: new Date(),
    descrizione: `${descrizione} - ${successo ? "Successo" : "Fallimento"}`,
  });
}

export async function eseguiRicarica(dto: RicaricaDto, ip?: string) {
  try {
    const conto = await ContoCorrenteModel.findById(dto.contoid);

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