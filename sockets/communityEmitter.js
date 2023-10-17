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
exports.RemoveTypingUser = exports.AddTypingUser = exports.broadCastNewCommunity = exports.searchCommunity = exports.JoinCommunity = void 0;
const server_1 = __importDefault(require("../server"));
const communityLink_1 = require("../models/communityLink");
const communityModel_1 = require("../models/communityModel");
const communityServices_1 = require("../services/communityServices");
const communityMessageModel_1 = require("../models/communityMessageModel");
const textUtils_1 = require("../utils/textUtils");
function handleCommunityMessage({ socket, community, type, text, imageUrl }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = socket.data.user;
        const message = yield communityMessageModel_1.communityMessageModel.create({
            community: community.customId, type, text, user: user._id, imageUrl
        });
        const newMessage = yield (0, communityServices_1.getCommunityMessages)({ _id: message._id });
        const alertText = (0, textUtils_1.truncateString)(`${socket.data.user.username}: ${text}`, 35);
        server_1.default.to(community.customId).emit("emit-community-alert", { alert: { link: `/community/chat/${community.slug}`, content: alertText },
            community
        });
        server_1.default.to(community.customId).emit("emit-community-message", newMessage[0]);
    });
}
function JoinCommunity({ socket, community }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = socket.data.user;
        yield communityLink_1.communityLinkModel.create({ user: user._id, community: community.customId });
        const message = yield communityMessageModel_1.communityMessageModel.create({
            community: community.customId, type: "system",
            text: `${socket.data.user.username} joined the chat`,
            user: user._id
        });
        socket.join(community.customId);
        socket.emit("emit-community-joined");
        const newMessage = yield (0, communityServices_1.getCommunityMessages)({ _id: message._id });
        const text = (0, textUtils_1.truncateString)(`${socket.data.user.username} just joined ${community.slug}`, 20);
        server_1.default.to(community.customId).emit("emit-community-alert", { alert: { link: `/community/chat/${community.slug}`, content: text },
            community
        });
        console.log(newMessage[0]);
        server_1.default.to(community.customId).emit("emit-community-message", newMessage[0]);
    });
}
exports.JoinCommunity = JoinCommunity;
function searchCommunity({ socket, text }) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield communityModel_1.communityModel.find({
            $or: [
                { name: { $regex: text, $options: 'i' } },
            ]
        });
        console.log(result);
        socket.emit("emit-community-search", result);
    });
}
exports.searchCommunity = searchCommunity;
function broadCastNewCommunity({ socket, community }) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.join(community.customId);
        socket.broadcast.emit("emit-alert", {
            content: `${socket.data.user.username} Created a new community !!`,
            link: `/community/chat/${community.slug}`
        });
    });
}
exports.broadCastNewCommunity = broadCastNewCommunity;
function AddTypingUser({ username, community }) {
    return __awaiter(this, void 0, void 0, function* () {
        server_1.default.to(community.customId).emit("emit-typing", { username, community });
    });
}
exports.AddTypingUser = AddTypingUser;
function RemoveTypingUser({ username, community }) {
    return __awaiter(this, void 0, void 0, function* () {
        server_1.default.to(community.customId).emit("emit-stop-typing", { username, community });
    });
}
exports.RemoveTypingUser = RemoveTypingUser;
exports.default = { handleCommunityMessage, JoinCommunity, searchCommunity, broadCastNewCommunity, AddTypingUser, RemoveTypingUser };
