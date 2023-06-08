import { Schema, model } from 'mongoose';

let sessionSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        immutable: true
    }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export default model('Session', sessionSchema);