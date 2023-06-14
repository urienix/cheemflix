import Category from "../models/category";
import logger from "../utils/logger";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new Category({ name });
        const categorySaved = await newCategory.save();
        if(!categorySaved._id) throw new Error('Error al crear la categoria');
        return res.status(200).send({
            type: 'success',
            title: 'Categoria creada',
            message: 'Categoria creada con exito'
        })
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Error al crear la categoria'
        })   
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).lean();
        return res.status(200).send({
            type: 'success',
            title: 'Categorias',
            message: 'Categorias encontradas',
            categories
        })
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Error al obtener las categorias'
        })   
    }
}

export const getCategoryById = async (req, res) => {
    try{
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).lean();
        if(category){
            return res.status(200).send({
                type: 'success',
                title: 'Categoria',
                message: 'Categoria encontrada',
                category
            })
        }else{
            return res.status(404).send({
                type: 'error',
                title: 'Error',
                message: 'Categoria no encontrada'
            })
        }
    }catch(error){
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Error al obtener la categoria'
        })   
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { categoryId, name } = req.body;
        await Category.findByIdAndUpdate(categoryId, { name });
        return res.status(200).send({
            type: 'success',
            title: 'Categoria actualizada',
            message: 'Categoria actualizada con exito'
        })
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Error al actualizar la categoria'
        })   
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        await Category.findByIdAndDelete(categoryId);
        return res.status(200).send({
            type: 'success',
            title: 'Categoria eliminada',
            message: 'Categoria eliminada con exito'
        })
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Error al eliminar la categoria'
        })   
    }
}

// internal functions, will be used in other controllers
export const getCategoriesList = async () => {
    try {
        const categories = await Category.find({}).lean();
        return categories;
    } catch (error) {
        logger.error(error.message);
        return [];
    }
}