import { ContoCorrente } from "./conto-corrente-entity";
import { model,Schema } from "mongoose";

const ContoCorrenteSchema = new Schema<ContoCorrente>({
    cognomeTitolare: {type: String, required: true},
    nomeTitolare: {type: String, required: true},
    dataApertura: {type: Date, required: true},
    iban: {type: String, required: true, unique: true}
});

ContoCorrenteSchema.set('toJSON',{
    virtuals:true,
    transform: (_document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        return returnedObject;
    }
});

ContoCorrenteSchema.virtual('fullname').get(function () {
  return  `${this.nomeTitolare} ${this.cognomeTitolare}`;;
});

export const ContoCorrenteModel= model<ContoCorrente>('ContoCorrente',ContoCorrenteSchema);