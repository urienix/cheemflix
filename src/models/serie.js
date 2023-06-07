import { Schema, model } from 'mongoose';

let SerieSchema = new Schema({
    title: String,
    sinopsis: String,
    allowKids: {
        type: Boolean,
        default: false
    },
    image: String,
    language: String,
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    episodes: [{
        number: Number,
        title: String,
        description: String,
        link: String,
        duration: Number, // In minutes
        cast: [String],
        addedAt: {
            type: Date,
            default: Date.now()
        }
    }],
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default model('Serie', SerieSchema);
