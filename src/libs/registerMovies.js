import Movies from '../models/movie';
import Category from '../models/category';
import logger from '../utils/logger';

export const registerMovies = async () => {
    let drama = (await Category.findOne({ name: 'Drama' }).lean())._id.toString();
    let humor = (await Category.findOne({ name: 'Humor' }).lean())._id.toString();
    let noticias = (await Category.findOne({ name: 'Noticias' }).lean())._id.toString();
    let terror = (await Category.findOne({ name: 'Terror' }).lean())._id.toString();
        
    let brujaserobanino = await Movies.findOne({ title: 'BRUJA se R0BA a un NIÑO con DERECHO por NO estar BAUTIZADO' });
    if (!brujaserobanino) {
        await new Movies({
            title: 'BRUJA se R0BA a un NIÑO con DERECHO por NO estar BAUTIZADO',
            sinopsis: 'El dia de hoy les traigo esta historia,hilo,relato,historias con cheems, historias de cheems, hilos de cheems, madre con derecho,primo con derecho,niño con derecho,cheems,doge,hilos con cheems o abro hilo de cheems en el cual les contare la vez en la que una bruja se rob0 a un niño con derecho por no estar bautizado espero les guste esta  historia, hilo, relato, historias con cheems,historias de cheems, hilos de cheems, madre con derecho, primo con derecho, niño con derecho, cheems, doge, hilos con cheems o abro hilo de cheems',
            allowKids: true,
            image: '/img/movieswalls/brujaserobanino.png',
            link: 'https://www.youtube.com/watch?v=3Aqi0oBbccQ',
            language: 'Español',
            categories: [drama, humor],
            cast: ['Bruja', 'Niño', 'Padre', 'Madre'],
            duration: 8.56,
            rating: 4.5
        }).save();
        logger.info('BRUJA se R0BA a un NIÑO con DERECHO por NO estar BAUTIZADO registered');
    }

    let comonoserasaltado = await Movies.findOne({ title: 'Como no ser asaltado' });
    if (!comonoserasaltado) {
        await new Movies({
            title: 'Como no ser asaltado',
            sinopsis: 'Historia contada sobre como me hice amigo de mi asaltante',
            allowKids: true,
            image: '/img/movieswalls/comonoserasaltado.png',
            link: 'https://www.youtube.com/watch?v=9PBGV9X87wg',
            language: 'Español',
            categories: [drama, humor],
            cast: ['Asaltante', 'Yo'],
            duration: 3.54,
            rating: 4.5
        }).save();
        logger.info('Como no ser asaltado registered');
    }
        

    let gorserias = await Movies.findOne({ title: 'Gorserias' });
    if (!gorserias) {
        await new Movies({
            title: 'Gorserias',
            sinopsis: 'Unos reporteros se agarran a groserias en vivo',
            allowKids: false,
            image: '/img/movieswalls/gorserias.png',
            link: 'https://www.youtube.com/watch?v=2mdr_wVsfis',
            language: 'Español',
            categories: [humor, noticias],
            cast: ['Raul', 'Dabid'],
            duration: 1.37,
            rating: 5
        }).save();
        logger.info('Gorserias registered');
    }
}