import User from "../models/user";
import Session from "../models/session";
import ms from "ms";
import { createAccessToken, createSessionToken, verifySessionToken } from "../middlewares/jwtoken";
import config from "../config/config";
import logger from "../utils/logger";

import { sendMail, buildMailTemplate, buildRecoveryPasswordMailTemplate } from "../utils/sendMail";

// requestedFrom is used to know if the request is from api or web, only have two posible values: api or web
export let login = async function (email, password, remember) {
    try {
        let result = await User.findOne({
            email
        }, {
            _id: 1,
            fullname: 1,
            password: 1,
            role: 1,
            active: 1,
            verified: 1
        });
        if (!result) {
            return {
                ok: false,
                type: 'error',
                title: "Credenciales inválidas",
                message: "Usuario y/o contraseña incorrectos"
            };
        }
        if(!result.active) {
            return {
                ok: false,
                type: 'error',
                title: "Cuenta deshabilitada",
                message: "La cuenta no tiene permisos para iniciar sesión"
            };
        }
        if(!result.verified) {
            return {
                ok: false,
                type: 'error',
                title: "Cuenta no verificada",
                message: "La cuenta no ha sido verificada, por favor revisa tu correo electrónico"
            };
        }
        if (!(await result.matchPassword(password))) {
            return {
                ok: false,
                type: 'error',
                title: "Credenciales inválidas",
                message: "Usuario y/o contraseña incorrectos"
            };
        }
        let user = {
            userId: result._id.toString(),
            role: result.role,
            fullname: result.fullname
        };

        let session = await Session({
            user: result._id,
            expiresAt: new Date(Date.now() + ms(remember ? '1y' : '3h'))
        }).save();

        let sessiontoken = createSessionToken(session._id.toString(), (remember ? '1y' : '3h'));
        let accesstoken = createAccessToken(user, '1h');

        return {
            ok: true,
            type: 'success',
            title: "Acceso concedido",
            message: "Sesión iniciada correctamente",
            user,
            accesstoken,
            sessiontoken
        }
    } catch (err) {
        logger.error(err);
        return {
            ok: false,
            type: 'error',
            title: "Error desconocido",
            message: "Se ha producido un error desconocido, por favor intenta de nuevo más tarde."
        };
    }
}

export let register = async (req, res) => {
    try {
        const { fullname, email, password, repassword } = req.body;
        if (password !== repassword) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Contraseñas no coinciden",
                message: "Las contraseñas no coinciden, por favor verifica e intenta de nuevo."
            });
        }
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Email ya registrado",
                message: "El email ya se encuentra registrado, por favor intenta con otro."
            });
        }
        user = new User({
            fullname,
            email,
            password
        })
        user.password = await user.encryptPassword(password);
        await user.save();
        let link = `${config.HOST_DOMAIN}/verify/${user._id.toString()}`;
        sendMail(email, "Verifica tu cuenta de CheemFlix", buildMailTemplate(fullname, link));
        return res.status(200).send({
            type: 'success',
            title: "Registro exitoso",
            message: "Se ha enviado un correo electrónico para verificar tu cuenta."
        });
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(500).send({
            ok: false,
            type: 'error',
            title: "Error desconocido",
            message: "Se ha producido un error desconocido, por favor intenta de nuevo más tarde."
        });        
    }
}


export let verify = async (req, res) => {
    let { userId } = req.params;
    try {
        let user = await User.findById(userId);
        if(!user) {
            return res.render('others/message', { title: 'Enlace inválido', message: 'Parece que el enlace ya no es válido', type:'danger', link: `${config.HOST_DOMAIN}/login`, linkText: 'Volver al login'});
        }
        if(user.verified) {
            return res.render('others/message', { title: 'Cuenta ya verificada', message: 'La cuenta ya se encuentra verificada, puedes iniciar sesión', type:'success', link: `${config.HOST_DOMAIN}/login`, linkText: 'Ir al login'});
        }
        user.verified = true;
        await user.save();
        return res.render('others/message', { title: 'Cuenta verificada', message: 'La cuenta ha sido verificada, puedes iniciar sesión', type:'success', link: `${config.HOST_DOMAIN}/login`, linkText: 'Ir al login'});           
    } catch (error) {
        logger.error(error);
        return res.render('others/message', { title: 'Error desconocido', message: 'Se ha producido un error desconocido, por favor intenta de nuevo más tarde.', type:'danger', link: `${config.HOST_DOMAIN}/login`, linkText: 'Volver al login'});        
    }
}


export let passwordReset = async (req, res) => {
    let { email } = req.body;
    email = email.trim();
    try {
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Email no registrado",
                message: "El email no se encuentra registrado, por favor intenta con otro."
            });
        }
        let securityCode = Math.floor(100000 + Math.random() * 900000);
        user.passwordResetToken = securityCode;
        user.passwordResetExpires = new Date(Date.now() + ms('1h'));
        await user.save();
        
        sendMail(email, "Codigo para reestablecer contraseña de CheemFlix", buildRecoveryPasswordMailTemplate(user.fullname, securityCode));

        return res.status(200).send({
            type: 'success',
            title: "Correo enviado",
            message: "Se ha enviado un correo electrónico para restablecer tu contraseña."
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).send({
            ok: false,
            type: 'error',
            title: "Error desconocido",
            message: "Se ha producido un error desconocido, por favor intenta de nuevo más tarde."
        });        
    }
}

export let passwordResetVerify = async (req, res) => {
    let { email, passwordResetToken, password, repassword } = req.body;
    console.log(req.body);
    try {
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Email no registrado",
                message: "El email no se encuentra registrado, por favor intenta con otro."
            });
        }
        if(user.passwordResetToken !== passwordResetToken) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Código incorrecto",
                message: "El código de seguridad es incorrecto, por favor verifica e intenta de nuevo."
            });
        }
        if (password !== repassword) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Contraseñas no coinciden",
                message: "Las contraseñas no coinciden, por favor verifica e intenta de nuevo."
            });
        }
        if(user.passwordResetExpires < new Date()) {
            return res.status(400).send({
                ok: false,
                type: 'error',
                title: "Código expirado",
                message: "El código de seguridad ha expirado, por favor intenta de nuevo."
            });
        }
        user.password = await user.encryptPassword(password);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
        return res.status(200).send({
            type: 'success',
            title: "Contraseña actualizada",
            message: "La contraseña ha sido actualizada, puedes iniciar sesión."
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: "Error desconocido",
            message: "Se ha producido un error desconocido, por favor intenta de nuevo más tarde."
        });        
    }
}