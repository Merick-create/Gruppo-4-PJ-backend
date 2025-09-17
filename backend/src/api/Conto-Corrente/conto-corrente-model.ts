import { ContoCorrente } from "./conto-corrente-entity";
import { model,Schema } from "mongoose";

const ContoCorrenteSchema = new Schema<ContoCorrente>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cognomeTitolare: {type: String, required: true},
    nomeTitolare: {type: String, required: true},
    dataApertura: {type: Date, required: true},
    iban: {type: String, required: true, unique: true}
});

ContoCorrenteSchema.set('toJSON',{
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        return returnedObject;
    }
});


export const ContoCorrenteModel= model<ContoCorrente>('ContoCorrente',ContoCorrenteSchema);