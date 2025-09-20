import { Movimenti } from "./movimenti-entity";
import { model,Schema } from "mongoose";

const MovimentiSchema = new Schema<Movimenti>({
    ContoCorrenteId: {type: String, required: true,ref: 'ContoCorrente'},
    dataCreazione: {type: Date, required: true},
    importo: {type: Number, required: true},
    saldo: {type: Number},
    CategoriaMovimentoid: {type: Schema.Types.ObjectId, required: true, ref: 'CategorieMovimenti'},
    descrizione: {type: String, required: true}
});

MovimentiSchema.set('toJSON',{
    transform: (_document, returnedObject) => {
        return returnedObject;
    }   
});

export const MovimentiModel= model<Movimenti>('Movimentis',MovimentiSchema);