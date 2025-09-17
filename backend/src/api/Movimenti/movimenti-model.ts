import { Movimenti } from "./movimenti-entity";
import { model,Schema } from "mongoose";

const MovimentiSchema = new Schema<Movimenti>({
    ContoCorrenteId: {type: String, required: true,ref: 'ContoCorrente'},
    dataCreazione: {type: Date, required: true},
    impoto: {type: Number, required: true},
    saldo: {type: Number, required: true},
    CategoriaMovimentoid: {type: String, required: true, ref: 'CategorieMovimenti'},
    descrizione: {type: String, required: true}
});

MovimentiSchema.set('toJSON',{
    transform: (_document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        return returnedObject;
    }   
});

export const CategorieMovimentiModel= model<Movimenti>('Movimenti',MovimentiSchema);