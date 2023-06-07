import { Schema, model } from "mongoose";

let MovieSchema = new Schema({
    title: String,
    sinopsis: String,
    allowKids: {
        type: Boolean,
        default: false
    },
    image: String,
    link: String,
    language: String,
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    cast: [String],
    duration: Number, // In minutes
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default model('Movie', MovieSchema);