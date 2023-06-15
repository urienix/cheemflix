import Category from '../models/category';
import logger from '../utils/logger';

export const registerCategories = async () => {
    let drama = await Category.findOne({ name: 'Drama' });
    if (!drama) {
        await new Category({ name: 'Drama' }).save();
        logger.info('Drama category registered');
    }

    let humor = await Category.findOne({ name: 'Humor' });
    if (!humor) {
        await new Category({ name: 'Humor' }).save();
        logger.info('Humor category registered');
    }

    let noticias = await Category.findOne({ name: 'Noticias' });
    if (!noticias) {
        await new Category({ name: 'Noticias' }).save();
        logger.info('Noticias category registered');
    }

    let terror = await Category.findOne({ name: 'Terror' });
    if (!terror) {
        await new Category({ name: 'Terror' }).save();
        logger.info('Terror category registered');
    }
}