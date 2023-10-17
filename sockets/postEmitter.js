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
const server_1 = __importDefault(require("../server"));
const NotificationModel_1 = require("../models/NotificationModel");
const postServices_1 = require("../services/postServices");
function dispatchLikePost({ socket, post }) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.broadcast.emit("emit-like-post", post);
        const posterUsername = post.postUser.username;
        const posterId = post.postUser._id;
        const likedBy = socket.data.user.username;
        if (likedBy !== posterUsername) {
            const isLiked = post.isliked;
            const content = `${likedBy} just ${isLiked ? "liked" : "unliked"} your post`;
            const link = `/post/detail/${post.customId}`;
            yield NotificationModel_1.notificationModel.create({
                user: posterId, link,
                content: `${likedBy} ${isLiked ? "liked" : "unliked"} your post ${post.description}`
            });
            server_1.default.to(posterUsername).emit("emit-alert", { content, link });
        }
    });
}
function broadCastNewPost({ socket, post }) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.broadcast.emit("emit-new-post", post);
        socket.broadcast.emit("emit-alert", {
            content: `${socket.data.user.username} just posted !!`,
            link: `/post/detail/${post.customId}`
        });
    });
}
function dispatchRepost({ socket, post }) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0, postServices_1.getSinglePost)({ user: socket.data.user, query: { customId: post.repostedId } });
        server_1.default.emit("emit-like-post", data[0]);
        //may be removed
        socket.broadcast.emit("emit-new-post", post);
        //may be removed
        const posterUsername = post.postUser.username;
        const repostedusername = socket.data.user.username;
        const link = `/post/detail/${post.customId}`;
        yield NotificationModel_1.notificationModel.create({
            user: post.postUser._id, link,
            content: `${repostedusername} reposted your post ${post.description}`
        });
        socket.to(posterUsername).emit("emit-alert", { content: `${repostedusername} just reposted your post`, link });
        // const posterId = post.postUser._id 
    });
}
function dispatchPostMessage({ socket, message, poster, postId }) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.broadcast.emit("emit-post-messsage", message);
        const link = `/post/detail/${postId}`;
        if (poster._id !== message.messageUser._id) {
            yield NotificationModel_1.notificationModel.create({
                user: poster._id, link,
                content: `${message.messageUser.username} commented on your post`
            });
            socket.to(poster.username).emit('emit-alert', {
                content: `${message.messageUser.username} just commented on your post`, link
            });
        }
    });
}
function dispatchReplyMessage({ socket, messager, reply, postId }) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.broadcast.emit("emit-post-reply", reply);
        const link = `/post/detail/${postId}`;
        if (messager._id !== socket.data.user._id) {
            yield NotificationModel_1.notificationModel.create({
                user: messager._id, link,
                content: `${socket.data.user.username} replied to your comment`
            });
            socket.to(messager.username).emit('emit-alert', {
                content: `${socket.data.user.username} just replied to your comment`,
                link
            });
        }
    });
}
exports.default = { dispatchLikePost, broadCastNewPost, dispatchRepost, dispatchPostMessage, dispatchReplyMessage };
