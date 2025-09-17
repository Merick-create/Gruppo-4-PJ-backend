import { ContoCorrente } from "../../../api/Conto-Corrente/conto-corrente-entity"

export type UserIdentity = {
    id: string,
    provider: string,
    credentials: {
        username: string,
        hashedPassword: string
    },
    user: ContoCorrente,
    refreshToken: string
}