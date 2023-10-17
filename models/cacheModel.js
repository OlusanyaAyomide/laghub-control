"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cacheSchema = new mongoose_1.default.Schema({
    tag: { type: String },
    value: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.cacheModel = mongoose_1.default.model("cache", cacheSchema);
