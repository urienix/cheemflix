import { Router } from 'express';

import authRoutes from './auth.routes';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";

const router = Router();


router

    .use(authRoutes)

    .get('/', async (req, res) => {
        return res.redirect('/login');
    })

    .get('/admin/home', checkSessionView, refreshAccessTokenView, async (req, res) => {
        return res.render('admin/movies');
    })

    .get('/movies', checkSessionView, refreshAccessTokenView, async (req, res) => {
        return res.render('client/movies');
    })

    .get('/error', async (req, res) => {
        return res.render('errors/error');
    })

export default router;