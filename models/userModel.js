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
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const slugify_1 = __importDefault(require("slugify"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String },
    profileImage: { type: String },
    password: { type: String, select: false },
    slug: { type: String },
    profileTheme: { type: String },
    lastSeen: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, 12);
        const userString = (0, slugify_1.default)(this.username);
        const length = this.username.trim().split(" ").length;
        if (length === 1) {
            this.username = userString;
            return next();
        }
        const unique = Math.floor(100 + Math.random() * 900).toString();
        this.username = `${userString}-${unique}`;
        next();
    });
});
userSchema.methods.checkPassword = function (inputpassword, hashedpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isCorrect = yield bcrypt_1.default.compare(inputpassword, hashedpassword);
        return isCorrect;
    });
};
userSchema.pre(/^find/, function (next) {
    this.select("-__v -password");
    next();
});
exports.userModel = mongoose_1.default.model("user", userSchema);
