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
exports.globalSearch = exports.handleDisconnect = exports.handleConnection = void 0;
const userModel_1 = require("../models/userModel");
const server_1 = __importDefault(require("../server"));
const communityServices_1 = require("../services/communityServices");
const communityModel_1 = require("../models/communityModel");
let array = [];
function handleConnection({ socket }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = socket.data.user;
        socket.join(user.username);
        console.log(user.username, " Is Connected");
        const communities = yield (0, communityServices_1.getCommunityList)({ user: user._id });
        const userrooms = [];
        // console.log(communities)
        communities.map((item) => {
            userrooms.push(item.rooms.customId);
        });
        console.log(userrooms);
        socket.join(userrooms);
        let isPresent = false;
        array.map((item) => {
            if (item.username === user.username) {
                isPresent = true;
            }
        });
        if (!isPresent) {
            array.push(user);
        }
        server_1.default.emit("emit-online", array);
        socket.broadcast.emit("emit-alert", {
            content: `${user.username} is online, send user a Dm`,
            link: `/chats/${user.username}`
        });
        console.log(array);
    });
}
exports.handleConnection = handleConnection;
function handleDisconnect({ socket }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = socket.data.user;
        console.log("disconnected", user.username);
        const newArray = [];
        array.map((item) => {
            if (item.username !== user.username) {
                newArray.push(item);
            }
        });
        server_1.default.emit("emit-online", newArray);
        array = newArray;
        const curentTime = new Date();
        const lastOnline = yield userModel_1.userModel.findByIdAndUpdate(user._id, { lastSeen: curentTime });
        console.log(array);
    });
}
exports.handleDisconnect = handleDisconnect;
function globalSearch({ socket, data }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.userModel.find({
            $or: [
                { firstName: { $regex: data, $options: 'i' } },
                { lastName: { $regex: data, $options: 'i' } },
                { username: { $regex: data, $options: 'i' } },
            ]
        });
        const community = yield communityModel_1.communityModel.find({
            $or: [
                { name: { $regex: data, $options: 'i' } },
            ]
        });
        socket.emit("search-result", { user, community });
    });
}
exports.globalSearch = globalSearch;
exports.default = { handleConnection, globalSearch, handleDisconnect };
