import { Router } from 'express';
const router = Router();

import { checkSessionView, refreshAccessTokenView, createAccessToken } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed } from "../middlewares/others";

router
    .get('/', checkSessionView, refreshAccessTokenView, async (req, res) => {
        const { user } = req;
        return res.render('client/profiles', { user });
    })

    .get('/new', checkSessionView, refreshAccessTokenView, async (req, res) => {
        const { user } = req;
        let profile = {
            _id: '0',
            name: '',
            avatar: '/img/default-avatar.png',
            type: 'adult'
        }

        return res.render('client/profileForm', { user, formTitle: 'Crear perfil', profile });
    })


export default router;