"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketDispatcher = void 0;
const postEmitter_1 = __importDefault(require("./postEmitter"));
const communityEmitter_1 = __importDefault(require("./communityEmitter"));
const socketControllers_1 = __importDefault(require("./socketControllers"));
const DmEmmiter_1 = __importDefault(require("./DmEmmiter"));
function socketDispatcher(socket) {
    socketControllers_1.default.handleConnection({ socket });
    socket.on("global-search", (data) => {
        socketControllers_1.default.globalSearch({ socket, data });
    });
    socket.on("send-community-message", (data) => {
        communityEmitter_1.default.handleCommunityMessage(Object.assign(Object.assign({}, data), { socket }));
    });
    socket.on("join-community", (community) => {
        communityEmitter_1.default.JoinCommunity({ socket, community });
    });
    socket.on("disconnect", (s) => {
        socketControllers_1.default.handleDisconnect({ socket });
    });
    socket.on("like-post", (post) => {
        postEmitter_1.default.dispatchLikePost({ socket, post });
    });
    socket.on("new-post", (post) => {
        postEmitter_1.default.broadCastNewPost({ socket, post });
    });
    socket.on("re-post", (post) => {
        postEmitter_1.default.dispatchRepost({ socket, post });
    });
    socket.on("create-post-message", (body) => {
        postEmitter_1.default.dispatchPostMessage(Object.assign(Object.assign({}, body), { socket }));
    });
    socket.on("create-post-reply", (body) => {
        postEmitter_1.default.dispatchReplyMessage(Object.assign(Object.assign({}, body), { socket }));
    });
    socket.on("search-community", ({ text }) => {
        communityEmitter_1.default.searchCommunity({ socket, text });
    });
    socket.on("new-community", (community) => {
        communityEmitter_1.default.broadCastNewCommunity({ socket, community });
    });
    socket.on("typing", (body) => {
        communityEmitter_1.default.AddTypingUser(body);
    });
    socket.on("stop-typing", (body) => {
        communityEmitter_1.default.RemoveTypingUser(body);
    });
    socket.on("send-dm", (data) => {
        DmEmmiter_1.default.handlePrivateMessage(Object.assign(Object.assign({}, data), { socket }));
    });
    socket.on("read-chat", (message) => {
        DmEmmiter_1.default.handleIsRead({ socket, message });
    });
    socket.on("dm-typing", (body) => {
        DmEmmiter_1.default.handleStartType(Object.assign({ socket }, body));
    });
    socket.on("follow-user", (body) => {
        DmEmmiter_1.default.followUser(Object.assign({ socket }, body));
    });
}
exports.socketDispatcher = socketDispatcher;
