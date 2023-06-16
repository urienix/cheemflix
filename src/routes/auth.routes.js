import { Router } from 'express';

import { login, register, verify } from "../controllers/auth.controller";
import { body, param, validationResult } from "express-validator";
import ms from 'ms';
import config from '../config/config';


const router = Router();

router

    .get('/login', async (req, res) => {
        let { accesstoken, sessiontoken, profileId } = req.cookies;
        if(sessiontoken) res.clearCookie('sessiontoken');
        if(accesstoken) res.clearCookie('accesstoken');
        if(profileId) res.clearCookie('profileId');
        return res.render('auth/login');
    })

    .post('/login', [
        body('email')
            .not().isEmpty().withMessage('Email de usuario requerido')
            .isEmail().withMessage('Email de usuario invalido'),
        body('password')
            .not().isEmpty().withMessage('Contraseña requerida')
            .isLength({ min: 5, max: 20 }).withMessage('Contraseña debe tener entre 5 y 20 caracteres'),
        body('remember')
            .not().isEmpty().withMessage('Recordarme requerido')
            .isBoolean().withMessage('Recordarme debe ser un valor booleano')
    ], (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                type: 'error',
                title: errors.array()[0].msg,
                details: errors.array()[0].msg
            });
        }
        return next();
    }, async (req, res) => {
        const { email, password, remember } = req.body;
        let result = await login( email, password, remember);
        if( result.type === 'success' ){
            return res
                .cookie('accesstoken', result.accesstoken, { maxAge: ms('15m'), httpOnly: false, sameSite: 'strict', secure: true }) // httpOnly setted to false because we want to use it in the frontend for make refresh token
                .cookie('sessiontoken', result.sessiontoken, { maxAge: ms(remember ? '1y' : '3h'), httpOnly: true, sameSite: 'strict', secure: true })
                .redirect('/home');
        }else{
            return res.status(401).send({
                title: result.title,
                message: result.message,
                type: result.type
            });
        }
    })

    .get('/register', async (req, res) => {
        return res.render('auth/register');
    })

    .post('/register', [
        body('fullname')
            .not().isEmpty().withMessage('Nombre completo requerido')
            .isLength({ min: 5, max: 50 }).withMessage('Nombre completo debe tener entre 5 y 50 caracteres'),
        body('email')
            .not().isEmpty().withMessage('Email de usuario requerido')
            .isEmail().withMessage('Email de usuario invalido'),
        body('password')
            .not().isEmpty().withMessage('Contraseña requerida')
            .isLength({ min: 5, max: 20 }).withMessage('Contraseña debe tener entre 5 y 20 caracteres'),
        body('repassword')
            .not().isEmpty().withMessage('Confirmación de contraseña requerida')
            .isLength({ min: 5, max: 20 }).withMessage('Confirmación de contraseña debe tener entre 5 y 20 caracteres'),
    ], (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                type: 'error',
                title: errors.array()[0].msg,
                details: errors.array()[0].msg
            });
        }
        return next();
    }, register)

    .get('/verify/:userId', [
        param('userId')
            .not().isEmpty().withMessage('Identificador de usuario requerido')
            .isMongoId().withMessage('Enlace de usuario invalido')
    ], (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('others/message', { title: 'Enlace inválido', message: 'Parece que el enlace ya no es válido', type:'danger', link: `${config.HOST_DOMAIN}/login`, linkText: 'Volver al login'});
        }
        return next();
    }, verify)

export default router;