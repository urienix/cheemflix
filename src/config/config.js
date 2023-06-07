import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

// Getting public and private keys RSA files
let JWT_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, ['../../', process.env.JWT_PUBLIC_KEY].join('')), 'utf8') || '';
let JWT_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, ['../../', process.env.JWT_PRIVATE_KEY].join('')), 'utf8') || '';

// Getting environment variables
export default {
    PORT: process.env.PORT || 3000,
    MONGO_CONNECTION: process.env.MONGO_CONNECTION,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JWT_PUBLIC_KEY,
    JWT_PRIVATE_KEY
};

