import { createLogger, format, transports } from 'winston';
import colors from 'colors';

import config from "../config/config";

const customFormat = format.combine(format.colorize(), format.timestamp(), format.printf((info) => {
    let { timestamp, level, message } = info;
    return ['[' + level + ']', new Date(timestamp).toLocaleString().green, '=>'.cyan, message].join(' ');
}));

let logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.File({
            maxsize: 16777216, // 16MB
            maxFiles: 5,
            filename: `${__dirname}/../../logs/error.log`,
            level: 'error'
        }),
        new transports.File({
            maxsize: 33554432, // 32MB
            maxFiles: 5,
            filename: `${__dirname}/../../logs/combined.log`
        })
    ]
});

//if (config.ENVIRONMENT != 'PRODUCTION') {
    logger.add(new transports.Console({
        format: format.combine(customFormat)
    }));
//}

export default logger;