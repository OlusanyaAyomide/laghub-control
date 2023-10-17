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
exports.validateUserUpdate = exports.validateUSerchecks = exports.validateUSerDm = exports.validateFollowUser = exports.validateUserLogIn = exports.ValidateNewUser = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
function ValidateNewUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required().allow(""),
            password: joi_1.default.string().required(),
            username: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            profileImage: joi_1.default.string().required(),
            profileTheme: joi_1.default.string().required()
        });
        const validation = schema.validate(req.body);
        // console.log(validation.error)
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.ValidateNewUser = ValidateNewUser;
function validateUserLogIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required()
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateUserLogIn = validateUserLogIn;
function validateFollowUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            _id: joi_1.default.string().required(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateFollowUser = validateFollowUser;
function validateUSerDm(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            username: joi_1.default.string().required(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            console.log(validation.error.details);
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateUSerDm = validateUSerDm;
function validateUSerchecks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            username: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            isgoogle: joi_1.default.boolean().required()
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            console.log(validation.error.details);
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateUSerchecks = validateUSerchecks;
function validateUserUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            console.log(validation.error.details);
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateUserUpdate = validateUserUpdate;
