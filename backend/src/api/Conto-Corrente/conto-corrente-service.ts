import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { ContoCorrente } from "./conto-corrente-entity";
import { ContoCorrenteModel } from "./conto-corrente-model";
import bcrypt from 'bcrypt';

export class UserExistsError extends Error {
    constructor() {
        super();
        this.name = 'UserExists';
        this.message = 'username already in use';
    }
}

export class UserService {

    async add(user: ContoCorrente, credentials: {username: string, password: string}): Promise<ContoCorrente> {
        const existingIdentity = await UserIdentityModel.findOne({'credentials.username': credentials.username});
        if (existingIdentity) {
            throw new UserExistsError();
        }
        const newUser = await ContoCorrenteModel.create(user);
        
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
    
        await UserIdentityModel.create({
            provider: 'local',
            user: newUser.id,
            credentials: {
                username: credentials.username,
                hashedPassword
            }
        });
    
        return newUser;
    }
}

export default new UserService();
