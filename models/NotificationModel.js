"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users' },
    content: { type: String },
    link: { type: String },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.notificationModel = mongoose_1.default.model("notification", notificationSchema);
