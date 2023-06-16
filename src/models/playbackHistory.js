import { Schema, model } from "mongoose";

let PlaybackHistorySchema = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default model('PlaybackHistory', PlaybackHistorySchema);