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
exports.validatePostDetail = exports.validateCreatereply = exports.validateCreateMessage = exports.validateLikePost = exports.validateCreatePost = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
function validateCreatePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            type: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            postUrl: joi_1.default.string().optional(),
            _id: joi_1.default.string().optional(),
            reposted: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.string()).optional(),
            postedAt: joi_1.default.string().optional(),
            repostedId: joi_1.default.string().optional(),
            repostedAvatar: joi_1.default.string().optional(),
            repostedTheme: joi_1.default.string().optional(),
            authorId: joi_1.default.string().optional(),
            repostedusername: joi_1.default.string().optional(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateCreatePost = validateCreatePost;
function validateLikePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            post: joi_1.default.string().required(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateLikePost = validateLikePost;
function validateCreateMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            post: joi_1.default.string().required(),
            text: joi_1.default.string().required(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateCreateMessage = validateCreateMessage;
function validateCreatereply(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            message: joi_1.default.string().required(),
            text: joi_1.default.string().required(),
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validateCreatereply = validateCreatereply;
function validatePostDetail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object().keys({
            post: joi_1.default.string().required()
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error });
        }
        return next();
    });
}
exports.validatePostDetail = validatePostDetail;
