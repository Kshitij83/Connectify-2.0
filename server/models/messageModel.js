import mongoose from 'mongoose';
import { userModel } from './userModel.js';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true },
    message: { type: String, default: '' }, // text, audio (base64), or image (base64)
    messageType: { type: String, enum: ['text', 'audio', 'image'], default: 'text' },
    fileName: { type: String }, // for image
    timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.model('messageModel', messageSchema);
export { messageModel };