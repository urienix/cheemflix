import User from "../models/user";
import Session from "../models/session";
import ms from "ms";
import { createAccessToken, createSessionToken, verifySessionToken } from "../middlewares/jwtoken";
import logger from "../utils/logger";

import { sendMail, buildMailTemplate } from "../utils/sendMail";

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
            active: 1
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
        logger.error(error);
        return res.status(500).send({
            ok: false,
            type: 'error',
            title: "Error desconocido",
            message: "Se ha producido un error desconocido, por favor intenta de nuevo más tarde."
        });        
    }
}
