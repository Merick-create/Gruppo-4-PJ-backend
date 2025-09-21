import { CategorieMovimentiModel } from "./categorie-model";
import { CategorieMovimenti } from "./categorie-entity";

export class CategorieMovimentiService {


  async createCategoria(dto: Omit<CategorieMovimenti, "id">) {
    const categoria = await CategorieMovimentiModel.create(dto);
    return categoria;
  }

  async getCategoriaById(id: string) {
    const categoria = await CategorieMovimentiModel.findById(id);
    if (!categoria) throw new Error("Categoria non trovata");
    return categoria;
  }

  async getAllCategorie() {
    return await CategorieMovimentiModel.find();
  }

  async updateCategoria(id: string, update: Partial<CategorieMovimenti>) {
    const categoria = await CategorieMovimentiModel.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    if (!categoria) throw new Error("Categoria non trovata");
    return categoria;
  }

  async deleteCategoria(id: string) {
    const categoria = await CategorieMovimentiModel.findByIdAndDelete(id);
    if (!categoria) throw new Error("Categoria non trovata");
    return { message: "Categoria eliminata con successo" };
  }
  
  async getCategoriaByNome(nome: string) {
  const categoria = await CategorieMovimentiModel.findOne({ Nome: nome });
  if (!categoria) throw new Error("Categoria non trovata");
  return categoria;
}
}

export default new CategorieMovimentiService();