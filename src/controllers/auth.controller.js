import User from "../models/user";
import Session from "../models/session";
import ms from "ms";
import { createAccessToken, createSessionToken, verifySessionToken } from "../middlewares/jwtoken";
import logger from "../utils/logger";

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