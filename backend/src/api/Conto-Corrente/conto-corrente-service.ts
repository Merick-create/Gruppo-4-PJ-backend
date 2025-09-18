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

export class    UserService {

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

     async update(
    contoId: string,
    updateData: Partial<ContoCorrente>,
    credentials?: { username?: string; password?: string }
  ): Promise<ContoCorrente | null> {
    const updatedUser = await ContoCorrenteModel.findByIdAndUpdate(
      contoId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Conto non trovato");
    }

    if (credentials) {
      const identity = await UserIdentityModel.findOne({ user: contoId });
      if (identity) {
        if (credentials.username) {
          identity.credentials.username = credentials.username;
        }
        if (credentials.password) {
          identity.credentials.hashedPassword = await bcrypt.hash(
            credentials.password,
            10
          );
        }
        await identity.save();
      }
    }

    return updatedUser;
  }
  async delete(contoId: string): Promise<void> {
    await ContoCorrenteModel.findByIdAndDelete(contoId);
    await UserIdentityModel.deleteOne({ user: contoId });
  }
}

export default new UserService();
