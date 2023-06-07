import { Schema, model } from "mongoose";

let CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default model('Category', CategorySchema);