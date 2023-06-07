import { Router } from 'express';

import authRoutes from './auth.routes';

const router = Router();


router

    .use(authRoutes)

    .get('/', async (req, res) => {
        return res.redirect('/login');
    })

    .get('/error', async (req, res) => {
        return res.render('errors/error');
    })

export default router;