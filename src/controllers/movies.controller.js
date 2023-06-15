import Movie from "../models/movie";
import logger from "../utils/logger";

export const createMovie = async (req, res) => {
    try {
        const { title, sinopsis, allowKids, image, link, language, categories, cast, duration } = req.body;
        const newMovie = new Movie({ title, sinopsis, allowKids, image, link, language, categories, cast, duration });
        const movieSaved = await newMovie.save();
        if(!movieSaved._id) throw new Error('Error al crear la película');
        return res.status(200).send({
            type: 'success',
            title: 'Película creada',
            message: 'La película se ha creado correctamente'
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Ha ocurrido un error al crear la película'
        });
    }
}

export const getMovies = async (req, res) => {
    try{
        const movies = await Movie.find({}).populate('categories');
        return res.status(200).send({
            type: 'success',
            title: 'Películas',
            message: 'Lista de películas',
            movies
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Ha ocurrido un error al obtener las películas'
        });
    }
}

export const getMovie = async (req, res) => {
    try{
        const movie = await Movie.findById(req.params.id).populate('categories');
        return res.status(200).send({
            type: 'success',
            title: 'Película',
            message: 'Película encontrada',
            movie
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: 'Ha ocurrido un error al obtener la película'
        });
    }
}


// internal functions, will be used only on other controllers
export const getMoviesList = async (isKid) => {
    try{
        let movies = [];
        if(isKid) {
            movies = await Movie.find({allowKids: true}).populate('categories').lean();
        } else {
            movies = await Movie.find({}).populate('categories').lean();
        }
        return movies;
    } catch (error) {
        logger.error(error);
        return [];
    }
}