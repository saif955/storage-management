// to store temporary codes
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PasswordResetCodeSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }

});

export default mongoose.model('PasswordResetCode', PasswordResetCodeSchema);
