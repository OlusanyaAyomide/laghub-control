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
exports.authenticateSocket = void 0;
const userModel_1 = require("../models/userModel");
const constants_1 = require("../config/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateSocket(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let decoded = "";
        try {
            decoded = jsonwebtoken_1.default.verify(token, constants_1.JWTSECRET);
        }
        catch (err) {
            return false;
        }
        if (!decoded) {
            return false;
        }
        if (typeof (decoded) !== "string") {
            const user = yield userModel_1.userModel.findById(decoded.id);
            if (user) {
                return user;
            }
            else {
                return false;
            }
        }
    });
}
exports.authenticateSocket = authenticateSocket;
