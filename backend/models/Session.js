import mongoose, { Schema } from "mongoose";
const {ObjectId} = Schema.Types;

const sessionSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    jsonFileUrl: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;