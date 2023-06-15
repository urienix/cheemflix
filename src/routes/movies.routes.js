import { Router } from 'express';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed, checkIfUserHaveSelectedProfile } from "../middlewares/others";

const router = Router();

router

    .get('/', checkSessionView, refreshAccessTokenView, checkIfUserHaveSelectedProfile, checkIfUserRolIsAllowed(['user']), async (req, res) => {
        const { user, profile } = req;
        return res.render('client/movies', { user, profile });
    })

export default router;