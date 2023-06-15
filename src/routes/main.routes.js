import { Router } from 'express';

import authRoutes from './auth.routes';
import errorRoutes from './error.routes';
import profileRoutes from './profiles.routes';
import moviesRoutes from './movies.routes';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed, checkIfUserHaveSelectedProfile } from "../middlewares/others";

const router = Router();


router

    .use(authRoutes)
    .use(errorRoutes)
    .use('/profiles', profileRoutes)
    .use('/movies', moviesRoutes)

    
    .get('/', async (req, res) => {
        return res.redirect('/login');
    })
    
    .get('/home', checkSessionView, refreshAccessTokenView, checkIfUserHaveSelectedProfile, async (req, res) => {
        return res.redirect('/movies')
    })
    
export default router;