import jwtoken from 'jsonwebtoken';
import config from '../config/config';
import "../controllers/connection";
import Session from '../models/session';
import User from '../models/user';
import ms from 'ms';
import logger from '../utils/logger';

//Create token for client requests
export const createAccessToken = (user, expiresIn) => { // expiresIn: '15m'
    return jwtoken.sign({user}, config.JWT_PRIVATE_KEY, { algorithm: "RS256", expiresIn });
};

//Create token for sessin management
export const createSessionToken = (sessionId, expiresIn) => { // expiresIn: '1y'
    return jwtoken.sign({sessionId}, config.JWT_PRIVATE_KEY, { algorithm: "RS256", expiresIn });
}

//Return the sessionId from the token
export const verifySessionToken = (sessiontoken) => {
    try {
        let session = jwtoken.verify(sessiontoken, config.JWT_PUBLIC_KEY);
        return {type: "success", sessionId: session.sessionId};
    } catch (error) {
        logger.error(error);
        if (error.name === 'JsonWebTokenError') {
            switch (error.message) {
                case 'invalid signature':
                    return { 
                        type: "error", 
                        title: 'Sesión invalida', 
                        details: 'Se ha detectado un intento de acceso no autorizado, si tratas de colarte en la fiesta sin ser invitado, al menos trae galletas de chocolate >:v'
                     };
                    break;
                default:
                    return { 
                        type: "error", 
                        title: 'Problemas con la sesion', 
                        details: 'No podemos vericicar la sesión, por lo que recomendamos iniciar una nueva sesión' 
                    };
                    break;
            }
        }else if(error.name === 'TokenExpiredError'){
            return { 
                type: "error", 
                title: 'Sesión expirada', 
                details: 'Debes iniciar sesión nuevamente' 
            };
        } else {
            return { 
                type: "error", 
                title: 'Error inesperado', 
                details: 'Parece que algo salió mal, intenta de nuevo más tarde' 
            };
        }
    }
}

// ############ VIEWS MIDDLEWARE ###############################
// Check if session is valid and set user in req.user
export const checkSessionView = async (req, res, next) => {
    try {
        let { sessiontoken } = req.cookies;
        //if sessiontoken is not set, redirect to login
        if (!sessiontoken) {
            return res.redirect('/login');
        }
        let sessionCheck = verifySessionToken(sessiontoken);
        // if session is not valid, redirect to login
        if (sessionCheck.type === 'error') {
            return res
            .clearCookie('sessiontoken')
            .redirect('/login');
        }
        let session = await Session.findByIdAndUpdate(sessionCheck.sessionId, { $set: { lastAccessedAt: Date.now() }});
        // if session is not found, redirect to login
        if (!session) {
            return res
            .clearCookie('sessiontoken')
            .redirect('/login');
        }
        let sessionUser = await User.findById(session.user.toString());
        //user not found
        if (!sessionUser) {
            return res
            .clearCookie('sessiontoken')
            .redirect('/login');
        }
        //user not active
        if (!sessionUser.active) {
            return res
            .clearCookie('sessiontoken')
            .redirect('/login');
        }
        req.user = {
            userId: sessionUser._id.toString(),
            role: sessionUser.role,
            fullname: sessionUser.fullname
        };
        return next();
    } catch (error) {
        logger.error(error);
        return res.
            clearCookie('sessiontoken')
            .redirect('/login');
    }
}

//used only on web application
export const refreshAccessTokenView = async (req, res, next) => {
    try {
        let { user } = req;
        let accesstoken = createAccessToken(user, '15m');
        res.cookie('accesstoken', accesstoken, {
            maxAge: ms('15m'),
            httpOnly: false, //setted false to allow access from frontend to allow refresh token when session is expired
            sameSite: 'strict',
            secure: true
        });
        return next();
    } catch (error) {
        logger.error(error);
        return res.redirect('/login');
    }
}

//used only on web application login view
export const checkIfHaveActiveSessionView = async (req, res, next) => {
    try {
        let { sessiontoken } = req.cookies;
        if (!sessiontoken) {
            return next();
        }
        let sessionCheck = verifySessionToken(sessiontoken);
        if (sessionCheck.type === 'error') {
            return next();
        }
        let session = await Session.findByIdAndUpdate(sessionCheck.sessionId, { $set: { lastAccessedAt: Date.now() }});
        if (!session) {
            return next();
        }
        let sessionUser = await User.findById(session.user.toString());
        if (!sessionUser) {
            return next();
        }
        if (!sessionUser.active) {
            return next();
        }
        let user = {
            userId: sessionUser._id.toString(),
            role: sessionUser.role,
            fullname: sessionUser.fullname
        };
        let accesstoken = createAccessToken(user, '15m');
        return res
            .cookie('accesstoken', accesstoken, {
                maxAge: ms('15m'),
                httpOnly: false, //setted false to allow access from frontend to allow refresh token when session is expired
                sameSite: 'strict',
                secure: true
            })
            .redirect('/home');
    } catch (error) {
        logger.error(error);
        return next();
    }
}


// ############ APIS MIDDLEWARE ###############################
// Check if session is valid and set user in req.user and can be use in vews and apis
export const checkAccessApi = async (req, res, next) => {
    try {
        let accesstoken = req.cookies.accesstoken;
        if(!accesstoken){
            accesstoken = req.headers.accesstoken;
        }
        if (!accesstoken) 
            return res.status(401).send({ 
                ok: false, 
                type: "error", 
                title: 'Acceso denegado', 
                details: 'No se ha proporcionado una llave de acceso' 
            });
        let payload = jwtoken.verify(accesstoken, config.JWT_PUBLIC_KEY);
        let user = payload.user;
        if (!user) 
            return res.status(401).send({ 
                ok: false, 
                type: "error", 
                title: 'Acceso denegado', 
                details: 'No hay un usuario vinculado a la llave de acceso' 
            });
        req.user = user;
        return next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            switch (error.message) {
                case 'invalid signature':
                    return res.status(403).send({ 
                        ok: false, 
                        type: "error", 
                        title: 'Acceso denegado', 
                        details: 'Se ha detectado un intento de acceso no autorizado, si tratas de colarte en la fiesta sin ser invitado, al menos trae galletas de chocolate >:v' 
                    });
                    break;
                default:
                    return res.status(403).send({ 
                        ok: false, 
                        type: "error", 
                        title: 'Acceso denegado', 
                        details: 'No se ha podido verificar la llave de acceso' 
                    });
                    break;
            }
        }else if(error.name === 'TokenExpiredError'){
            return res.status(403).send({ 
                ok: false, 
                type: "error", 
                title: 'Llave de acceso expirada', 
                details: 'Debes generar una nueva llave de acceso' 
            });
        } else {
            return res.status(500).send({ 
                ok: false, 
                type: "error", 
                title: 'Error inesperado', 
                details: 'Parece que algo salió mal, intenta de nuevo más tarde' 
            });
        }
    }
}


// used only on REST API's
export const checkSessionApi = async (req, res, next) => {
    try {
        let { sessiontoken } = req.headers;
        if (!sessiontoken) {
            sessiontoken = req.cookies.sessiontoken;
        }
        //if sessiontoken is not set, redirect to login
        if (!sessiontoken) {
            return res
                .status(401)
                .send({
                    ok: false,
                    type: "error",
                    title: 'Sesion no encontrada',
                    details: 'No se ha proporcionado una sesion valida'
                });
        }
        let sessionCheck = verifySessionToken(sessiontoken);
        // if session is not valid, redirect to login
        if (sessionCheck.type === 'error') {
            return res
            .send({
                ok: false,
                type: sessionCheck.type,
                title: sessionCheck.title,
                details: sessionCheck.details
            });
        }
        let session = await Session.findByIdAndUpdate(sessionCheck.sessionId, { $set: { lastAccessedAt: Date.now() }});
        // if session is not found, redirect to login
        if (!session) {
            return res
                .send({
                    ok: false,
                    type: "error",
                    title: 'Sesion no encontrada',
                    details: 'No se ha encontrado la sesion'
                });
        }
        let sessionUser = await User.findById(session.user.toString());
        //user not found
        if (!sessionUser) {
            return res
                .send({
                    ok: false,
                    type: "error",
                    title: 'Usuario no encontrado',
                    details: 'No se ha encontrado ningun usuario vinculado a esta sesión'
                });
        }
        //user not active
        if (!sessionUser.active) {
            return res
                .send({
                    ok: false,
                    type: "error",
                    title: 'Usuario no activo',
                    details: 'El usuario no esta activo'
                });
        }
        req.user = {
            userId: sessionUser._id.toString(),
            role: sessionUser.role,
            fullname: sessionUser.fullname
        };
        return next();
    } catch (error) {
        logger.error(error);
        return res
            .status(500)
            .send({
                ok: false,
                type: "error",
                title: 'Error inesperado',
                details: 'Parece que algo salió mal, intenta de nuevo más tarde'
            });
    }
}

// used only on REST API's
export const refreshAccessTokenApi = async (req, res, next) => {
    try {
        let { user } = req;
        let accesstoken = createAccessToken(user, '15m');
        req.accesstoken = accesstoken;
        return next();
    } catch (error) {
        logger.error(error);
        return res
            .status(500)
            .send({
                ok: false,
                type: "error",
                title: 'Error inesperado',
                details: 'No pudimos generar la nueva llave de acceso, intenta mas tarde'
            });
    }
}