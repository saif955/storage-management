import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true,
        enum: ['pdf','image']
    },
    size: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    folder: {
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    }
});

export default mongoose.model('File', FileSchema);