"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DmSchema = new mongoose_1.default.Schema({
    sender: { type: String, ref: 'users' },
    receiver: { type: String, ref: 'users' },
    text: { type: String },
    type: { type: String },
    isRead: { type: Boolean, default: false },
    imageUrl: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.DmModel = mongoose_1.default.model("dm", DmSchema);
