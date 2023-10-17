"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityMessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const communityMessageSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users' },
    community: { type: String, ref: 'communities' },
    type: { type: String },
    text: { type: String },
    imageUrl: { type: String, default: null }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.communityMessageModel = mongoose_1.default.model("communityMessage", communityMessageSchema);
