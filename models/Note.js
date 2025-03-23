import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    content: {
        type: String,
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

export default mongoose.model('Note', NoteSchema);
