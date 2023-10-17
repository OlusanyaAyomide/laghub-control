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
exports.authenticateUser = void 0;
const userModel_1 = require("../models/userModel");
const constants_1 = require("../config/constants");
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Token is missing" });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, constants_1.JWTSECRET);
        }
        catch (err) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Token expired" });
        }
        if (!decoded) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Token is Invalid" });
        }
        if (typeof (decoded) !== "string") {
            const user = yield userModel_1.userModel.findById(decoded.id).lean();
            if (user) {
                req.user = user;
            }
            else {
                return Response_handler_1.default.sendErrorResponse({ res, error: "Token was not issued" });
            }
        }
        next();
    });
}
exports.authenticateUser = authenticateUser;
