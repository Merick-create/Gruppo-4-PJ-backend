import { CategorieMovimenti } from "../Categorie-Movimenti/categorie-entity";
import { ContoCorrente } from "../Conto-Corrente/conto-corrente-entity";

export type Movimenti={
    id:string;
    ContoCorrenteId:ContoCorrente;
    dataCreazione:Date;
    importo:number;
    saldo:number; 
    CategoriaMovimentoid:CategorieMovimenti;
    descrizione:string;
}