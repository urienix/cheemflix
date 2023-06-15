import { Router } from 'express';

import authRoutes from './auth.routes';
import errorRoutes from './error.routes';
import profileRoutes from './profiles.routes';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed } from "../middlewares/others";

const router = Router();


router

    .use(authRoutes)
    .use(errorRoutes)
    .use('/profiles', profileRoutes)
    
    .get('/', async (req, res) => {
        return res.redirect('/login');
    })

export default router;