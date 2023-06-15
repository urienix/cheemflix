import Profile from '../models/profile.js';
import logger from '../utils/logger.js';

export const saveProfile = async (req, res) => {
    try {
        const { avatar, name, type, profileId } = req.body;
        const { user } = req;
        let profile = null;
        if(profileId == '0'){
            let userProfiles = await Profile.find({ user: user.userId });
            if(userProfiles.length >= 5) throw new Error('No puedes crear más de 5 perfiles');
            profile = new Profile({
                avatar,
                name,
                type,
                user: user.userId
            });
        } else {
            profile = await Profile.findById(profileId);
            profile.avatar = avatar;
            profile.name = name;
            profile.type = type;
        }
        let saved = await profile.save();
        if(!saved._id) throw new Error('Error al guardar el perfil');
        return res.status(200).send({
            type: 'success',
            title: 'Perfil guardado',
            message: 'Perfil guardado correctamente'
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: error.message || 'Error al guardar el perfil'
        });
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const { profileId } = req.body;
        const { user } = req;
        let deleted = await Profile.deleteOne({ _id: profileId, user: user.userId });
        if(!deleted.deletedCount) throw new Error('Error al eliminar el perfil');
        return res.status(200).send({
            type: 'success',
            title: 'Perfil eliminado',
            message: 'Perfil eliminado correctamente'
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send({
            type: 'error',
            title: 'Error',
            message: error.message || 'Error al eliminar el perfil'
        });
    }
}

// internal functions, used only in other controllers or functions

export const getProfiles = async (userId) => {
    try {
        let profiles = await Profile.find({ user: userId }).lean();
        return profiles;
    } catch (error) {
        logger.error(error.message);
        return [];
    }
}