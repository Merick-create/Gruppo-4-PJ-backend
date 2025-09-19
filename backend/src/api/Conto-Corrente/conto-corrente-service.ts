import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { CategorieMovimentiModel } from "../Categorie-Movimenti/categorie-model";
import { MovimentiModel } from "../Movimenti/movimenti-model";
import { ContoCorrente } from "./conto-corrente-entity";
import { ContoCorrenteModel } from "./conto-corrente-model";
import bcrypt from "bcrypt";

export class UserExistsError extends Error {
  constructor() {
    super();
    this.name = "UserExists";
    this.message = "username already in use";
  }
}

export class UserService {
  async add(
    user: ContoCorrente,
    credentials: { username: string; password: string }
  ): Promise<ContoCorrente> {
    const existingIdentity = await UserIdentityModel.findOne({
      "credentials.username": credentials.username,
    });
    if (existingIdentity) {
      throw new UserExistsError();
    }
    const newUser = await ContoCorrenteModel.create(user);

    const apertura = await CategorieMovimentiModel.findOne({ Nome: "Apertura Conto" });

    await MovimentiModel.create({
      ContoCorrenteId: newUser._id,
      dataCreazione: new Date(),
      importo: 1000,
      saldo: 1000,
      CategoriaMovimentoid: apertura,
      descrizione: "Saldo iniziale",
    });

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    await UserIdentityModel.create({
      provider: "local",
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });

    return newUser;
  }

  async updatePassword(contoId: string, updatedPassword: string) {
    
    const hashedPassword = await bcrypt.hash(updatedPassword, 10);

    await UserIdentityModel.updateOne(
      { user: contoId },
      { $set: { "credentials.hashedPassword": hashedPassword } }
    );
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
