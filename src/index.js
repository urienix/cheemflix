import app from './app';
import logger from './utils/logger';

app.listen(app.get('port'), () => {
    logger.info(`Aplicación servida en http://127.0.0.1:${app.get('port')}`);    
});