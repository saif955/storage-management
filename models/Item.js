import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ItemSchema = new Schema({

    name:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['pdf','note','image','folder'],
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: Schema.Types.ObjectId,
        refPath: "type",
      },
      folder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
      },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});