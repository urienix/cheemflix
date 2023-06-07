import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ''
    },
    fullname: {
        type: String,
        default: ''
    },        
    passwordResetToken: {
        type: String,
        default: ''
    },
    passwordResetExpires: Date,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    birthdate: Date,
    address: String,
    accountType: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(13);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default model('User', UserSchema);