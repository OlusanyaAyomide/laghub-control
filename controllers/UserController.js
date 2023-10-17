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
exports.userNotification = exports.updateProfile = exports.getNewusername = exports.userProfilePage = exports.getUserChats = exports.userDmList = exports.CreateDm = exports.getUserProfile = exports.followerUser = exports.userLogIn = exports.userSignUp = void 0;
const constants_1 = require("../config/constants");
const userModel_1 = require("../models/userModel");
const Response_handler_1 = __importDefault(require("../utils/Response-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DmServcies_1 = require("../services/DmServcies");
const followerModel_1 = require("../models/followerModel");
const DmModel_1 = require("../models/DmModel");
const postServices_1 = require("../services/postServices");
const slugify_1 = __importDefault(require("slugify"));
const customID_1 = require("../utils/customID");
const NotificationModel_1 = require("../models/NotificationModel");
function userSignUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email } = req.body;
        // const isExisting = await userModel.find([{username}, {email}])
        const isExisting = yield userModel_1.userModel.find({
            $or: [{ username }, { email }]
        });
        if (isExisting.length > 0) {
            return Response_handler_1.default.sendErrorResponse({ res, code: 400, error: "Username or Email Already exist" });
        }
        const newuser = yield userModel_1.userModel.create(req.body);
        const user = yield userModel_1.userModel.findById(newuser._id).lean();
        const adminUser = yield userModel_1.userModel.findOne({ username: "goConnect-Official" });
        if (adminUser) {
            yield DmModel_1.DmModel.create({ sender: adminUser.username, receiver: user === null || user === void 0 ? void 0 : user.username, type: "text", text: `Hi ${user === null || user === void 0 ? void 0 : user.username} welcome to goConnect,it is nice to have you on board` });
            yield NotificationModel_1.notificationModel.create({ user: user === null || user === void 0 ? void 0 : user._id, content: "Account created succesfully,go Connecting !!", link: "/" });
        }
        const token = jsonwebtoken_1.default.sign({ id: newuser._id, email: newuser.email }, constants_1.JWTSECRET, { expiresIn: "200d" });
        return Response_handler_1.default.sendSuccessResponse({ res, data: { user: Object.assign(Object.assign({}, user), { followers: 0, following: 0, unread: 1 }),
                token } });
    });
}
exports.userSignUp = userSignUp;
function userLogIn(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const user = yield userModel_1.userModel.findOne({ email }).select("password username createdAt firstName lastName email profileImage profileTheme lastSeen");
        if (!user) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Email is invalid" });
        }
        const isPasswordCorrect = yield user.checkPassword(password, user.password);
        if (!isPasswordCorrect) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Password is invalid" });
        }
        const loggedinUser = yield userModel_1.userModel.findById(user._id).lean();
        // const {username,createdAt,firstName,lastName,email,profileImage,profileTheme} = user
        const followers = yield followerModel_1.followerModel.find({ followers: user._id }).count();
        const following = yield followerModel_1.followerModel.find({ following: user._id }).count();
        const unread = yield DmModel_1.DmModel.find({ receiver: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username, isRead: false }).count();
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, constants_1.JWTSECRET, { expiresIn: "200d" });
        return Response_handler_1.default.sendSuccessResponse({ res, data: { user: Object.assign(Object.assign({}, loggedinUser), { followers, following, unread }),
                token } });
    });
}
exports.userLogIn = userLogIn;
function followerUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { _id } = req.body;
        const newfollower = yield followerModel_1.followerModel.create({ following: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, followers: _id });
        return Response_handler_1.default.sendSuccessResponse({ res });
    });
}
exports.followerUser = followerUser;
function getUserProfile(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const followers = yield followerModel_1.followerModel.find({ followers: user === null || user === void 0 ? void 0 : user._id }).count();
        const following = yield followerModel_1.followerModel.find({ following: user === null || user === void 0 ? void 0 : user._id }).count();
        const unread = yield DmModel_1.DmModel.find({ receiver: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username, isRead: false }).count();
        return Response_handler_1.default.sendSuccessResponse({ res, data: {
                user: Object.assign(Object.assign({}, user), { followers, following, unread })
            } });
    });
}
exports.getUserProfile = getUserProfile;
function CreateDm(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { username, type, text, imageUrl } = req.body;
        const newmessage = yield DmModel_1.DmModel.create({ sender: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username, receiver: username, type, text, imageUrl });
        return Response_handler_1.default.sendSuccessResponse({ res, data: newmessage });
    });
}
exports.CreateDm = CreateDm;
function userDmList(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const username = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
        const messages = yield (0, DmServcies_1.getUserLatestMessage)(username || "");
        return Response_handler_1.default.sendSuccessResponse({ res, data: messages });
    });
}
exports.userDmList = userDmList;
function getUserChats(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.params;
        const chatUser = yield userModel_1.userModel.find({ username }).lean();
        if (!chatUser) {
            return Response_handler_1.default.sendErrorResponse({ error: "User does not exist", res, code: 404 });
        }
        const data = yield (0, DmServcies_1.getChats)({ sender: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.username) || "", receiver: username });
        return Response_handler_1.default.sendSuccessResponse({ res, data: { chatUser: chatUser[0], messages: data } });
    });
}
exports.getUserChats = getUserChats;
function userProfilePage(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.params;
        const profileUser = yield userModel_1.userModel.findOne({ username }).lean();
        if (!profileUser) {
            return Response_handler_1.default.sendErrorResponse({ error: "User does not exist", res, code: 404 });
        }
        const followers = yield followerModel_1.followerModel.find({ followers: profileUser === null || profileUser === void 0 ? void 0 : profileUser._id }).count();
        const following = yield followerModel_1.followerModel.find({ following: profileUser === null || profileUser === void 0 ? void 0 : profileUser._id }).count();
        const isfollowing = yield followerModel_1.followerModel.findOne({ $and: [
                { following: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { followers: profileUser._id }
            ] }).lean();
        const comments = yield (0, postServices_1.getCommentsInfo)({ user: profileUser });
        const posts = yield (0, postServices_1.getSinglePost)({ user: req.user, query: {
                $or: [{ postedBy: profileUser === null || profileUser === void 0 ? void 0 : profileUser._id }, { repostedId: profileUser._id }]
            } });
        return Response_handler_1.default.sendSuccessResponse({ res, data: Object.assign(Object.assign({}, profileUser), { followers, following, isfollowing: !!isfollowing, comments, posts }) });
    });
}
exports.userProfilePage = userProfilePage;
function getNewusername(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, isgoogle } = req.body;
        const isEmailExist = yield userModel_1.userModel.findOne({ email });
        if (isEmailExist) {
            return Response_handler_1.default.sendErrorResponse({ res, error: "Email already exists" });
        }
        if (!isgoogle) {
            const slugusername = (0, slugify_1.default)(username);
            const isUsernameExist = yield userModel_1.userModel.findOne({ username: slugusername });
            if (isUsernameExist) {
                return Response_handler_1.default.sendErrorResponse({ res, error: "username already exists" });
            }
            return Response_handler_1.default.sendSuccessResponse({ res, data: { username } });
        }
        let generatedUsername = false;
        let userString = (0, slugify_1.default)(username);
        let newusername = "";
        while (!generatedUsername) {
            const isPresent = yield userModel_1.userModel.findOne({ username: userString });
            if (!isPresent) {
                newusername = userString;
                generatedUsername = true;
            }
            else {
                const uniqueID = (0, customID_1.generateRandomNumbers)(3);
                userString = `${userString}-${uniqueID}`;
            }
        }
        return Response_handler_1.default.sendSuccessResponse({ res, data: {
                username: newusername
            } });
    });
}
exports.getNewusername = getNewusername;
function updateProfile(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName } = req.body;
        const newuser = yield userModel_1.userModel.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, { firstName, lastName });
        return Response_handler_1.default.sendSuccessResponse({ res, data: {
                firstName, lastName
            } });
    });
}
exports.updateProfile = updateProfile;
function userNotification(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield NotificationModel_1.notificationModel.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ createdAt: -1 });
        return Response_handler_1.default.sendSuccessResponse({ res, data });
    });
}
exports.userNotification = userNotification;
