import { Log } from "./log-entity";
import { LogModel } from "./log-model";

export async function addLog(data: any){
    const newLog = await LogModel.create(data);
    return newLog;
}