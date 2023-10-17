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
exports.postDetail = exports.replyCreate = exports.messageCreate = exports.postLike = exports.postGetAll = exports.postCreate = void 0;
const PostModel_1 = require("../models/PostModel");
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
const postServices_1 = require("../services/postServices");
const customID_1 = require("../utils/customID");
const likeModel_1 = require("../models/likeModel");
const messageModel_1 = require("../models/messageModel");
const ReplyModel_1 = require("../models/ReplyModel");
function postCreate(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { reposted, _id, type, description, postUrl, postedAt, repostedId, authorId, repostedTheme, repostedAvatar, repostedusername } = req.body;
        const isReposted = !!reposted;
        const postedBy = isReposted ? authorId : (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (isReposted) {
            yield PostModel_1.postModel.findByIdAndUpdate(_id, { $inc: { repostCount: 1 } });
        }
        const customId = yield (0, customID_1.generateUniqueID)(PostModel_1.postModel, "post");
        const newPost = yield PostModel_1.postModel.create({ postedBy, type, description, postUrl, reposted, customId, repostedTheme, repostedAvatar, postedAt, repostedId, repostedusername });
        const data = yield (0, postServices_1.getPostsDetail)({ req, userpage: 1, pagelimit: 5, query: { _id: newPost._id } });
        return Response_handler_1.default.sendSuccessResponse({ res, data: data[0] });
    });
}
exports.postCreate = postCreate;
function postGetAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, limit } = req.query;
        const userpage = Number(page ? page : 1);
        const pagelimit = Number(limit ? limit : 5);
        const total = yield PostModel_1.postModel.countDocuments();
        const data = yield (0, postServices_1.getPostsDetail)({ req, userpage, pagelimit, query: {} });
        const totalPage = Math.ceil(total / pagelimit);
        return Response_handler_1.default.sendSuccessResponse({ res, data: {
                page: userpage,
                limit: pagelimit,
                total: totalPage,
                isLast: userpage === totalPage,
                data
            } });
    });
}
exports.postGetAll = postGetAll;
function postLike(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { post } = req.body;
        const isLiked = yield likeModel_1.likeModel.findOne({
            $and: [
                { post }, { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }
            ]
        });
        if (isLiked) {
            const unlike = yield likeModel_1.likeModel.findByIdAndDelete(isLiked._id);
        }
        else {
            const like = yield likeModel_1.likeModel.create({ post, user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        }
        const test = yield likeModel_1.likeModel.find({});
        const model = yield PostModel_1.postModel.findById(post);
        const tester2 = yield PostModel_1.postModel.aggregate([{ $match: { customId: model === null || model === void 0 ? void 0 : model.customId } }]);
        const data = yield (0, postServices_1.getPostsDetail)({ req, userpage: 1, pagelimit: 1, query: { customId: model === null || model === void 0 ? void 0 : model.customId } });
        return Response_handler_1.default.sendSuccessResponse({ res, data: data[0] });
    });
}
exports.postLike = postLike;
function messageCreate(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { post, text } = req.body;
        const customId = yield (0, customID_1.generateUniqueID)(messageModel_1.messageModel, "message");
        const data = yield messageModel_1.messageModel.create({ text, customId, post, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        const messages = yield (0, postServices_1.getPostMessages)({ _id: data._id });
        return Response_handler_1.default.sendSuccessResponse({ res, data: messages[0] });
    });
}
exports.messageCreate = messageCreate;
function replyCreate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, text } = req.body;
        const customId = yield (0, customID_1.generateUniqueID)(ReplyModel_1.replyModel, "reply");
        yield ReplyModel_1.replyModel.create({ text, customId, message, user: Object.assign({}, req.user) });
        const replymessage = yield messageModel_1.messageModel.findById(message);
        const messages = yield (0, postServices_1.getPostMessages)({ _id: replymessage === null || replymessage === void 0 ? void 0 : replymessage._id });
        return Response_handler_1.default.sendSuccessResponse({ res, data: messages[0] });
    });
}
exports.replyCreate = replyCreate;
function postDetail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customId = req.params.customId;
        const postobject = yield PostModel_1.postModel.findOne({ customId: customId }).lean();
        if (!postobject) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Resource not found or has been deleted", code: 404 });
        }
        const post = yield (0, postServices_1.getPostsDetail)({ req, userpage: 1, pagelimit: 1, query: { customId } });
        const outpost = post[0];
        const messages = yield (0, postServices_1.getPostMessages)({ post: postobject === null || postobject === void 0 ? void 0 : postobject._id });
        const data = Object.assign(Object.assign({}, outpost), { messages });
        return Response_handler_1.default.sendSuccessResponse({ res, data });
    });
}
exports.postDetail = postDetail;
