import { getProfile } from '../controllers/profiles.controller.js';

export const checkIfUserRolIsAllowed = (allowedRoles) => {
    return (req, res, next) => {
        let role = req.user.role;
        return allowedRoles.includes(role) ? next() : res.status(403).redirect('/403');
    };
};

export const checkIfUserHaveSelectedProfile = async (req, res, next) => {
    const { profileId } = req.cookies;
    if(!profileId) return res.status(403).redirect('/profiles');
    let profile = await getProfile(profileId);
    if(!profile) return res.status(403).redirect('/profiles');
    req.profile = {
        profileId: profile._id,
        name: profile.name,
        avatar: profile.avatar,
        isKid: profile.type == 'kid'
    };
    return next();
}