import { Router } from 'express';

import authRoutes from './auth.routes';
import errorRoutes from './error.routes';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed } from "../middlewares/others";

const router = Router();


router

    .use(authRoutes)
    .use(errorRoutes)

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

    .get('/admin/movies', checkSessionView, refreshAccessTokenView, checkIfUserRolIsAllowed(['admin']), async (req, res) => {
        const { user } = req;
        return res.render('admin/movies', { user });
    })

    .get('/movies', checkSessionView, refreshAccessTokenView, async (req, res) => {
        const { user } = req;
        return res.render('client/movies', { user });
    })

export default router;