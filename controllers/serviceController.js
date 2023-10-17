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
exports.getTikTokVideo = void 0;
const tiktokprocessor_1 = require("../requests/tiktok/tiktokprocessor");
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
function getTikTokVideo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = req.query.page;
        const data = yield (0, tiktokprocessor_1.tiktokProcessor)(page || "1");
        if (data) {
            return Response_handler_1.default.sendSuccessResponse({ res, data });
        }
        else {
            return Response_handler_1.default.sendErrorResponse({ res, code: 500, error: "Something went wrong" });
        }
    });
}
exports.getTikTokVideo = getTikTokVideo;
