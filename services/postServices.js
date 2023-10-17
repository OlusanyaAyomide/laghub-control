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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsInfo = exports.getSinglePost = exports.getPostMessages = exports.getPostsDetail = void 0;
const PostModel_1 = require("../models/PostModel");
const messageModel_1 = require("../models/messageModel");
function getPostsDetail({ userpage, pagelimit, query, req }) {
    return __awaiter(this, void 0, void 0, function* () {
        const skipBy = (userpage * pagelimit) - pagelimit;
        const data = yield PostModel_1.postModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",
                    foreignField: "_id",
                    as: "postUser"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "post",
                    as: "likes"
                }
            },
            {
                $unwind: "$postUser"
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skipBy
            },
            {
                $limit: pagelimit
            },
        ]);
        const dataArray = [];
        data.map((item) => {
            var _a;
            let isliked = false;
            for (const like of item.likes) {
                if (String(like.user) === String((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
                    isliked = true;
                }
            }
            const newObject = Object.assign(Object.assign({}, item), { isliked, likes: item.likes.length });
            dataArray.push(newObject);
        });
        return dataArray;
    });
}
exports.getPostsDetail = getPostsDetail;
function getPostMessages(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield messageModel_1.messageModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "replies",
                    localField: "_id",
                    foreignField: "message",
                    as: "replies"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "messageUser"
                }
            },
            {
                $unwind: "$messageUser"
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
        ]);
        return data;
    });
}
exports.getPostMessages = getPostMessages;
function getSinglePost({ query, user }) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield PostModel_1.postModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",
                    foreignField: "_id",
                    as: "postUser"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "post",
                    as: "likes"
                }
            },
            {
                $unwind: "$postUser"
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        const dataArray = [];
        data.map((item) => {
            let isliked = false;
            for (const like of item.likes) {
                if (String(like.user) === String(user === null || user === void 0 ? void 0 : user._id)) {
                    isliked = true;
                }
            }
            const newObject = Object.assign(Object.assign({}, item), { isliked, likes: item.likes.length });
            dataArray.push(newObject);
        });
        return dataArray;
    });
}
exports.getSinglePost = getSinglePost;
function getCommentsInfo({ user }) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield messageModel_1.messageModel.aggregate([
            {
                $match: { user: user._id }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "post",
                    foreignField: "_id",
                    as: "post"
                }
            },
            {
                $unwind: "$post"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "post.postedBy",
                    foreignField: "_id",
                    as: "postUser"
                }
            },
            {
                $unwind: '$postUser'
            }
        ]);
    });
}
exports.getCommentsInfo = getCommentsInfo;
