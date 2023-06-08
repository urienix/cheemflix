import { Router } from 'express';

import authRoutes from './auth.routes';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";

const router = Router();


router

    .use(authRoutes)

    .get('/', async (req, res) => {
        return res.redirect('/login');
    })

    .get('/home', checkSessionView, async (req, res) => {
        const { user } = req;
        if(user.role === 'admin') {
            return res.redirect('/admin/movies');
        }else {
            return res.redirect('/movies');
        }
    })

    .get('/admin/movies', checkSessionView, refreshAccessTokenView, async (req, res) => {
        const { user } = req;
        return res.render('admin/movies', { user });
    })

    .get('/movies', checkSessionView, refreshAccessTokenView, async (req, res) => {
        const { user } = req;
        return res.render('client/movies', { user });
    })

    .get('/error', async (req, res) => {
        return res.render('errors/error');
    })

export default router;