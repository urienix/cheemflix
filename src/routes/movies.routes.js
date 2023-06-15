import { Router } from 'express';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed } from "../middlewares/others";

const router = Router();

router

    .get('/', checkSessionView, refreshAccessTokenView, checkIfUserRolIsAllowed(['user']), async (req, res) => {
        const { user } = req;
        return res.render('client/movies', { user });
    })

export default router;