import { Router } from 'express';
const router = Router();
import { body, validationResult } from 'express-validator';

import { checkSessionView, refreshAccessTokenView, createAccessToken } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed } from "../middlewares/others";

import { saveProfile, getProfiles, deleteProfile } from "../controllers/profiles.controller";

router
    .get('/', checkSessionView, refreshAccessTokenView, async (req, res) => {
        const { user } = req;
        let profiles = await getProfiles(user.userId);
        let showCreateProfile = profiles.length < 5;
        return res.render('client/profiles', { user, profiles, showCreateProfile });
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

    .post('/', checkSessionView, refreshAccessTokenView, [
        body('profileId').notEmpty().withMessage('El id del perfil es requerido'),
        body('name').notEmpty().withMessage('El nombre es requerido'),
        body('type')
            .notEmpty().withMessage('El tipo de perfil es requerido')
            .isIn(['adult', 'kid']).withMessage('El tipo de perfil no es válido'),
        body('avatar').notEmpty().withMessage('El avatar es requerido')
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                type: 'error',
                title: 'Error',
                message: errors.array()[0].msg
            });
        }
        return next();
    }, saveProfile)

    .delete('/', checkSessionView, refreshAccessTokenView, [
        body('profileId').notEmpty().withMessage('El id del perfil es requerido')
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                type: 'error',
                title: 'Error',
                message: errors.array()[0].msg
            });
        }
        return next();
    }, deleteProfile)


export default router;