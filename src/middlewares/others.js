export const checkIfUserRolIsAllowed = (allowedRoles) => {
    return (req, res, next) => {
        let role = req.user.role;
        return allowedRoles.includes(role) ? next() : res.status(403).redirect('/403');
    };
};