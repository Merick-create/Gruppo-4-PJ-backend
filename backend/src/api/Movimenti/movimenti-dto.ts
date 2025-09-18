export class MovimentiDTO{
    ibanMittente!:string;
    ibanDestinatario!:string;
    dataCreazione!:Date;
    impoto!:number;
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
  dataInizio: string;
  dataFine: string;  
}
