import { Router } from 'express';

import authRoutes from './auth.routes';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";

const router = Router();


router

    .use(authRoutes)

    .get('/', async (req, res) => {
        return res.redirect('/login');
    })

    .get('/home', checkSessionView, refreshAccessTokenView, async (req, res) => {
        return res.render('template');
    })

    .get('/error', async (req, res) => {
        return res.render('errors/error');
    })

export default router;