import User from '../models/user';
import config from '../config/config';

export const createAdmin = async () => {
    try {
        let user = await User.findOne({ role: 'admin' });

        if (!user) {
            user = new User({
                fullname: 'Administrador',
                email: 'admin',
                password: config.ADMIN_PASSWORD,
                role: 'admin'
            });

            user.password = await user.encryptPassword(user.password);

            await user.save();
            console.log('Admin user created'.green);
        }
    } catch (error) {
        console.log(error);
    }
}