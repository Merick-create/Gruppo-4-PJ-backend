import { HttpException, HttpStatus } from '@nestjs/common';
import { ContoCorrenteModel } from '../Conto-Corrente/conto-corrente-model';
import { MovimentiModel } from './movimenti-model';
import { LogModel } from '../log/log-model';
import { BonificoDto } from '../Bonfico/bonifico-dto';
import { Request } from 'express';

export async function eseguiBonifico(bonificoDto: BonificoDto, req: Request) {
    try {
        const contoMittente = await ContoCorrenteModel.findOne({ 
            iban: bonificoDto.ibanMittente 
        });
        const contoDestinatario = await ContoCorrenteModel.findOne({ 
            iban: bonificoDto.ibanDestinatario 
        });

        if (!contoMittente || !contoDestinatario) {
            await logOperazione(req.ip!, 'Bonifico fallito: IBAN non valido', false);
            throw new HttpException('IBAN non valido', HttpStatus.BAD_REQUEST);
        }

        const saldoMittente = await getSaldoConto(contoMittente.id);
        if (saldoMittente < bonificoDto.importo) {
            await logOperazione(req.ip!, 'Bonifico fallito: saldo insufficiente', false);
            throw new HttpException('Saldo insufficiente', HttpStatus.BAD_REQUEST);
        }

        await MovimentiModel.create({
            ContoCorrenteId: contoMittente.id,
            importo: -bonificoDto.importo,
            dataCreazione: new Date(),
            descrizione: `Bonifico in uscita: ${bonificoDto.descrizione}`,
            saldo: saldoMittente - bonificoDto.importo
        });

        const saldoDestinatario = await getSaldoConto(contoDestinatario.id);
        await MovimentiModel.create({
            ContoCorrenteId: contoDestinatario.id,
            importo: bonificoDto.importo,
            dataCreazione: new Date(),
            descrizione: `Bonifico in entrata: ${bonificoDto.descrizione}`,
            saldo: saldoDestinatario + bonificoDto.importo
        });

        await logOperazione(req.ip!, 'Bonifico eseguito con successo', true);
        return { message: 'Bonifico eseguito con successo' };

    } catch (error) {
        await logOperazione(req.ip!, `Errore durante il bonifico: ${error}`, false);
        throw error;
    }
}

export async function getSaldoConto(contoId: string): Promise<number> {
    const ultimoMovimento = await MovimentiModel
        .findOne({ ContoCorrenteId: contoId })
        .sort({ dataCreazione: -1 });
    return ultimoMovimento ? ultimoMovimento.saldo : 0;
}

export async function logOperazione(ip: string, descrizione: string, successo: boolean): Promise<void> {
    await LogModel.create({
        ip,
        dateOperation: new Date(),
        descrizione: `${descrizione} - ${successo ? 'Successo' : 'Fallimento'}`
    });
}