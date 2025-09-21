import { ContoCorrente } from "./conto-corrente-entity";
import { model,Schema } from "mongoose";

const ContoCorrenteSchema = new Schema<ContoCorrente>({
    cognomeTitolare: {type: String, required: true},
    nomeTitolare: {type: String, required: true},
    dataApertura: {type: Date, required: true},
    iban: {type: String, required: true, unique: true}
});

ContoCorrenteSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

ContoCorrenteSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

ContoCorrenteSchema.virtual('fullname').get(function () {
  return  `${this.nomeTitolare} ${this.cognomeTitolare}`;;
});

export const ContoCorrenteModel= model<ContoCorrente>('ContoCorrente',ContoCorrenteSchema);