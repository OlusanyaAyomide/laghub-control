"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const followerSchema = new mongoose_1.default.Schema({
    followers: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users' },
    following: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users' },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.followerModel = mongoose_1.default.model("follower", followerSchema);
