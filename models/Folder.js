import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentFolder: {
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
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
});

export default mongoose.model('Folder', FolderSchema);