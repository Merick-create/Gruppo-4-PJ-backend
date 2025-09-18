import { Log } from "./log-entity";

import { model,Schema } from "mongoose";

const LogSchema = new Schema<Log>({
    ip:String,
    dateOperation:{ type: Date, default: Date.now },
    descrizione:String
});

LogSchema.set('toJSON',{
    transform: (_document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        return returnedObject;
}});

LogSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const LogModel=model<Log>('Log',LogSchema);