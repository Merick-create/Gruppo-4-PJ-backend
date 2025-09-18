import { genericHandler } from "./generic";
import { notFoundHandler } from "./not-found-error";
import { validationHandler } from "./validation";

export const errorHandlers = [notFoundHandler, validationHandler, genericHandler]