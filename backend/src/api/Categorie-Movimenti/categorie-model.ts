import { CategorieMovimenti } from "./categorie-entity";
import { model,Schema } from "mongoose";

const CategorieMovimentiSchema = new Schema<CategorieMovimenti>({
    Nome: {type: String, required: true},
    Tipologia: {type: String, required: true}
});

CategorieMovimentiSchema.set('toJSON',{
    transform: (_document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        return returnedObject;
    }   
});

export const CategorieMovimentiModel= model<CategorieMovimenti>('CategorieMovimenti',CategorieMovimentiSchema);