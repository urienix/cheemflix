import mongoose from 'mongoose';
import config from "../config/config";

import logger from '../utils/logger';

mongoose.set('strictQuery', true);

mongoose.connect(config.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => {
    logger.info('Connected to database MongoDB');
});

db.on('error', (err) => {
    logger.error(err);
});

process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
        logger.info('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

export default db;