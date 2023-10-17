"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    type: { type: String },
    description: { type: String },
    postUrl: { type: String },
    customId: { type: String },
    repostCount: { type: Number, default: 0 },
    postedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    reposted: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: false
    },
    repostedTheme: { type: String },
    repostedAvatar: { type: String },
    postedAt: { type: String },
    repostedId: { type: String },
    authorId: { type: String },
    repostedusername: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.postModel = mongoose_1.default.model("post", postSchema);
