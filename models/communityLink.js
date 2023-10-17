"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityLinkModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const communitySchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users' },
    community: { type: String, ref: 'communities' },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.communityLinkModel = mongoose_1.default.model("communitylink", communitySchema);
