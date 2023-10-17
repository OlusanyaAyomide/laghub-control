"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const communitySchema = new mongoose_1.default.Schema({
    name: { type: String },
    slug: { type: String },
    customId: { type: String },
    description: { type: String },
    communityImage: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
communitySchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const comString = (0, slugify_1.default)(this.name);
        const length = this.name.trim().split(" ").length;
        if (length === 1) {
            this.slug = this.name;
            return next();
        }
        const unique = Math.floor(100 + Math.random() * 900).toString();
        this.slug = `${comString}-${unique}`;
        next();
    });
});
exports.communityModel = mongoose_1.default.model("community", communitySchema);
