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
exports.communityUsers = exports.mostActiveCommunities = exports.communityDetail = exports.JoinCommunity = exports.communityMessage = exports.newCommunity = void 0;
const communityModel_1 = require("../models/communityModel");
const customID_1 = require("../utils/customID");
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
const communityLink_1 = require("../models/communityLink");
const communityServices_1 = require("../services/communityServices");
const communityMessageModel_1 = require("../models/communityMessageModel");
function newCommunity(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, communityImage } = req.body;
        const isExisting = yield communityModel_1.communityModel.findOne({ name });
        if (isExisting) {
            return Response_handler_1.default.sendErrorResponse({ error: "Community with this name already existing", res });
        }
        const customId = yield (0, customID_1.generateUniqueID)(communityModel_1.communityModel, "community");
        const newCommunity = yield communityModel_1.communityModel.create({ description, communityImage, customId, name });
        const newComUser = yield communityLink_1.communityLinkModel.create({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, community: newCommunity.customId });
        // const pholder = await getCommunityInfo({community:customId})
        return Response_handler_1.default.sendSuccessResponse({ res, data: newCommunity });
    });
}
exports.newCommunity = newCommunity;
//for Websocket
function communityMessage(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { community, type, text, imageUrl } = req.body;
        // const isPresent = await communityLinkModel.find({community,user:req.user?._id,imageUrl})\
        const isPresent = yield communityLink_1.communityLinkModel.find({ community, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (isPresent.length === 0) {
            return Response_handler_1.default.sendErrorResponse({ error: "Not a Community Member", res });
        }
        const communityDetail = yield communityModel_1.communityModel.findOne({ customId: community }).lean();
        if (!community) {
            return Response_handler_1.default.sendErrorResponse({ error: "Community not found", res });
        }
        const newMessage = yield communityMessageModel_1.communityMessageModel.create({ community, imageUrl, type, text, user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        const userCount = yield communityLink_1.communityLinkModel.find({ community }).count();
        const messages = yield (0, communityServices_1.getCommunityMessages)({ community });
        return Response_handler_1.default.sendSuccessResponse({ res, data: {
                communityDetail, userCount, messages
            } });
    });
}
exports.communityMessage = communityMessage;
function JoinCommunity(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { community } = req.body;
        const isPresent = yield communityLink_1.communityLinkModel.find({ community, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (isPresent.length > 0) {
            return Response_handler_1.default.sendErrorResponse({ error: "Already a community Member", res });
        }
        const newComUser = yield communityLink_1.communityLinkModel.create({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, community });
        return Response_handler_1.default.sendSuccessResponse({ res, data: "joined" });
    });
}
exports.JoinCommunity = JoinCommunity;
function communityDetail(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { slug } = req.params;
        const communityDetail = yield communityModel_1.communityModel.findOne({ slug });
        if (!communityDetail) {
            return Response_handler_1.default.sendErrorResponse({ error: "Community not found on this server", res, code: 404 });
        }
        const messages = yield (0, communityServices_1.getCommunityMessages)({ community: communityDetail === null || communityDetail === void 0 ? void 0 : communityDetail.customId });
        const userCount = yield communityLink_1.communityLinkModel.find({ community: communityDetail === null || communityDetail === void 0 ? void 0 : communityDetail.customId }).count();
        const isMember = yield communityLink_1.communityLinkModel.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, community: communityDetail === null || communityDetail === void 0 ? void 0 : communityDetail.customId });
        return Response_handler_1.default.sendSuccessResponse({ res, data: { communityDetail, userCount, isMember: isMember.length > 0, messages } });
    });
}
exports.communityDetail = communityDetail;
function mostActiveCommunities(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const active = yield (0, communityServices_1.getActiveCommunities)();
        const community = yield (0, communityServices_1.getUserCommunityList)({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (community.length === 0) {
            return Response_handler_1.default.sendSuccessResponse({ res, data: { active, userCommunity: [] } });
        }
        const userCommunity = community[0].communities;
        return Response_handler_1.default.sendSuccessResponse({ res, data: { active, userCommunity } });
    });
}
exports.mostActiveCommunities = mostActiveCommunities;
function communityUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { customId } = req.params;
        // const users = await communityLinkModel.find({community:customId})
        const users = yield (0, communityServices_1.getCommunityUsers)({ community: customId });
        return Response_handler_1.default.sendSuccessResponse({ res, data: users });
    });
}
exports.communityUsers = communityUsers;
