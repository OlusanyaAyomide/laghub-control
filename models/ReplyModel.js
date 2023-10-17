"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const replySchema = new mongoose_1.default.Schema({
    message: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'messages' },
    text: { type: String },
    customId: { type: String },
    user: {
        firstName: { type: String },
        lastName: { type: String },
        username: { type: String },
        email: { type: String },
        profileImage: { type: String },
        profileTheme: { type: String },
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.replyModel = mongoose_1.default.model("reply", replySchema);
