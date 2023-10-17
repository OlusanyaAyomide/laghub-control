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
exports.handleIsRead = exports.handlePrivateMessage = void 0;
const server_1 = __importDefault(require("../server"));
const DmModel_1 = require("../models/DmModel");
const DmServcies_1 = require("../services/DmServcies");
const textUtils_1 = require("../utils/textUtils");
const NotificationModel_1 = require("../models/NotificationModel");
const followerModel_1 = require("../models/followerModel");
function handlePrivateMessage({ socket, receiver, type, text, imageUrl }) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(username,type,text,imageUrl)
        const user = socket.data.user;
        const isRead = user.username === receiver.username;
        const newentry = yield DmModel_1.DmModel.create({ sender: user.username, receiver: receiver.username, type, text, imageUrl, isRead });
        const newmessage = newentry.toObject();
        const message = Object.assign(Object.assign({}, newmessage), { sender: user, receiver });
        console.log(message);
        server_1.default.to(receiver.username).emit("emit-private-message", message);
        socket.emit("emit-private-message", message);
        server_1.default.to(receiver.username).emit("emit-dm-alert", {
            username: user.username,
            content: (0, textUtils_1.truncateString)(`${user.username}:${text}`, 30),
            link: `/chats/${user.username}`
        });
        const receiverdmList = yield (0, DmServcies_1.getUserLatestMessage)(receiver.username);
        server_1.default.to(receiver.username).emit("emit-user-dm", receiverdmList.conversations);
        const unread = yield DmModel_1.DmModel.find({ receiver: receiver.username, isRead: false }).count();
        socket.to(receiver.username).emit("emit-unread", { unread });
        const senderdmList = yield (0, DmServcies_1.getUserLatestMessage)(user.username);
        socket.emit("emit-user-dm", senderdmList.conversations);
    });
}
exports.handlePrivateMessage = handlePrivateMessage;
function handleIsRead({ socket, message }) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedMessage = yield DmModel_1.DmModel.findByIdAndUpdate(message._id, { isRead: true }, { new: true });
        const newmessage = updatedMessage === null || updatedMessage === void 0 ? void 0 : updatedMessage.toObject();
        const readMessage = Object.assign(Object.assign({}, newmessage), { sender: message.sender, receiver: message.receiver });
        const username = socket.data.user.username;
        const messageSender = message.sender.username;
        server_1.default.to(messageSender).emit("edit-private-message", readMessage);
        socket.emit("edit-private-message", readMessage);
        const unread = yield DmModel_1.DmModel.find({ receiver: username, isRead: false }).count();
        socket.emit("emit-unread", { unread });
        const senderDmList = yield (0, DmServcies_1.getUserLatestMessage)(messageSender);
        server_1.default.to(messageSender).emit("emit-user-dm", senderDmList.conversations);
        const receiverDmList = yield (0, DmServcies_1.getUserLatestMessage)(username);
        socket.emit("emit-user-dm", receiverDmList.conversations);
    });
}
exports.handleIsRead = handleIsRead;
function handleStartType({ socket, username, isTyping }) {
    return __awaiter(this, void 0, void 0, function* () {
        server_1.default.to(username).emit("emit-dm-typing", {
            isTyping,
            chatUser: socket.data.user.username
        });
    });
}
function followUser({ socket, username, _id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `/profile/${socket.data.user.username}`;
        yield NotificationModel_1.notificationModel.create({
            user: _id, link,
            content: `${socket.data.user.username} is now following you`
        });
        socket.to(username).emit('emit-alert', {
            content: `${socket.data.user.username} just followed you`,
            link
        });
        const count = yield followerModel_1.followerModel.find({ followers: _id }).count();
        socket.to(username).emit("emit-add-follower", { count });
    });
}
exports.default = { handlePrivateMessage, handleIsRead, handleStartType, followUser };
