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
    this.message = "email già in uso";
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

  async updatePassword(
    contoId: string,
    oldPassword: string,
    newPassword: string
  ) {
    if (!oldPassword || !newPassword) {
      throw new Error("Vecchia e nuova password sono richieste");
    }

    const identity = await UserIdentityModel.findOne({ user: contoId });
    if (!identity) {
      throw new Error("Utente non trovato");
    }

    const match = await bcrypt.compare(
      oldPassword,
      identity.credentials.hashedPassword
    );
    if (!match) {
      throw new Error("Vecchia password errata");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    identity.credentials.hashedPassword = hashedPassword;
    await identity.save();

    return { message: "Password aggiornata con successo" };
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

  async getEmail(contoId: string): Promise<string | null> {
    const user = await UserIdentityModel.findOne({ user: contoId }).lean();
    return user ? user.credentials.username : null;
  }

  async getPassword(contoId: string): Promise<string | null> {
    const identity = await UserIdentityModel.findOne({ user: contoId }).lean();
    return identity ? identity.credentials.hashedPassword : null;
  }

  async getNome(contoId: string): Promise<string | null> {
    const user = await ContoCorrenteModel.findById(contoId).lean();
    return user ? user.nomeTitolare : null;
  }

  async getCognome(contoId: string): Promise<string | null> {
    const user = await ContoCorrenteModel.findById(contoId).lean();
    return user ? user.cognomeTitolare : null;
  }

  async getDataApertura(contoId: string): Promise<Date | null> {
    const user = await ContoCorrenteModel.findById(contoId).lean();
    return user ? user.dataApertura : null;
  }

  async getIBAN(contoId: string): Promise<string | null> {
    const user = await ContoCorrenteModel.findById(contoId).lean();
    return user ? user.iban : null;
  }

  async getFullProfile(
    contoId: string
  ): Promise<Partial<ContoCorrente> | null> {
    const user = await ContoCorrenteModel.findById(contoId).lean();
    return user || null;
  }

  async confirmMail(email: string) {
    const user = await UserIdentityModel.findOne({
      "credentials.username": email,
    });
    if (!user) {
      throw new Error("Email non trovata");
    }

    const apertura = await CategorieMovimentiModel.findOne({
      Nome: "Apertura Conto",
    });

    const check = await MovimentiModel.findOne({ContoCorrenteId: user.user.id, CategoriaMovimentoid: apertura});
    if(check){
      throw new Error("Conto già aperto");
    }

    await MovimentiModel.create({
      ContoCorrenteId: user.user.id,
      dataCreazione: new Date(),
      importo: 0,
      saldo: 0,
      CategoriaMovimentoid: apertura,
      descrizione: "Apertura Conto Corrente",
    });
  }

  async sendMail(sendMail: string) {
    const nodemailer = require("nodemailer");

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lorenzoforner685@gmail.com",
        pass: "hnzg rbdl tznc ekrq",
      },
    });

    let mailOptions = {
      from: "lorenzoforner685@gmail.com",
      to: sendMail,
      subject: "Conferma la tua registrazione al conto corrente",
      text: `Gentile Cliente,

Grazie per esserti registrato al nostro servizio di conto corrente.
Per completare la registrazione, ti chiediamo di confermare il tuo indirizzo email cliccando sul link sottostante:

[Inserisci qui il link di conferma]

Se non hai effettuato questa registrazione, ignora questa email.

Cordiali saluti,
Il Team Banca`,
      html: `<h2>Conferma la tua registrazione al conto corrente</h2>
<p>Gentile Cliente,</p>
<p>Grazie per esserti registrato al nostro servizio di conto corrente.</p>
<p>Per completare la registrazione, ti chiediamo di confermare il tuo indirizzo email cliccando sul pulsante sottostante:</p>
<p style="text-align:center;">
  <a href="[Inserisci qui il link di conferma]" style="display:inline-block; padding:10px 20px; color:#fff; background-color:#007bff; text-decoration:none; border-radius:5px;">Conferma Registrazione</a>
</p>
<p>Se non hai effettuato questa registrazione, puoi ignorare questa email.</p>
<p>Cordiali saluti,<br><strong>Il Team Banca</strong></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error);
      }
      console.log("Email sent:", info.response);
    });
  }
}

export default new UserService();
