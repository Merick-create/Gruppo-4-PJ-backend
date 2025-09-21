import { Request, Response, NextFunction } from "express";
import CategorieMovimentiService from "./categorie-service";

export const createCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoria = await CategorieMovimentiService.createCategoria(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};

export const getCategoriaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoria = await CategorieMovimentiService.getCategoriaById(req.params.id);
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

export const getAllCategorie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categorie = await CategorieMovimentiService.getAllCategorie();
    res.json(categorie);
  } catch (error) {
    next(error);
  }
};
export const updateCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoria = await CategorieMovimentiService.updateCategoria(
      req.params.id,
      req.body
    );
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategorieMovimentiService.deleteCategoria(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCategoriaByNome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nome } = req.params;
    const categoria = await CategorieMovimentiService.getCategoriaByNome(nome);
    res.json({ id: categoria._id }); // restituiamo solo l'id
  } catch (error) {
    next(error);
  }
};
