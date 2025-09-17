export class MovimentiDTO{
    ContoCorrenteId!:string;
    dataCreazione!:Date;
    impoto!:number;
    saldo!:number;
    CategoriaMovimentoid!:string;
    descrizione!:string;
}

export interface QueryMovimentiDTO {
  n: number;
}

export interface QueryMovimentiCategoriaDTO {
  n: number;
  categoria: string;
}

export interface QueryMovimentiDateRangeDTO {
  n: number;
  dataInizio: string; // formato ISO
  dataFine: string;   // formato ISO
}
