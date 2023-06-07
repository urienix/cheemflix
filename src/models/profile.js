import { Schema, model } from "mongoose";

let ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: {
        type: String,
        default: '/img/default-avatar.png'
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['kid', 'adult'],
        default: 'adult'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default model('Profile', ProfileSchema);