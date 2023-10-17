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
exports.getCommunityUsers = exports.getUserCommunityList = exports.getActiveCommunities = exports.getCommunityList = exports.getCommunityMessages = exports.getCommunityInfo = void 0;
const communityModel_1 = require("../models/communityModel");
const communityLink_1 = require("../models/communityLink");
const communityMessageModel_1 = require("../models/communityMessageModel");
function getCommunityInfo(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield communityLink_1.communityLinkModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "participant"
                }
            }
        ]);
    });
}
exports.getCommunityInfo = getCommunityInfo;
function getCommunityMessages(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield communityMessageModel_1.communityMessageModel.aggregate([
            {
                $match: query
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
                    createdAt: 1
                }
            },
        ]);
    });
}
exports.getCommunityMessages = getCommunityMessages;
function getCommunityList(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield communityLink_1.communityLinkModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "communities",
                    localField: "community",
                    foreignField: "customId",
                    as: "rooms"
                }
            },
            {
                $unwind: "$rooms"
            },
        ]);
    });
}
exports.getCommunityList = getCommunityList;
function getActiveCommunities() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield communityModel_1.communityModel.aggregate([
            {
                $lookup: {
                    from: "communitymessages",
                    localField: "customId",
                    foreignField: "community",
                    as: "messages"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    messageCount: { $size: '$messages' },
                    description: 1,
                    communityImage: 1,
                    createdAt: 1,
                    slug: 1,
                    customId: 1
                },
            },
            {
                $sort: { messageCount: -1 }
            },
        ]);
    });
}
exports.getActiveCommunities = getActiveCommunities;
function getUserCommunityList(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield communityLink_1.communityLinkModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "communities",
                    localField: "community",
                    foreignField: "customId",
                    as: "communityData",
                },
            },
            {
                $unwind: "$communityData",
            },
            {
                $group: {
                    _id: null,
                    communities: { $push: "$communityData" },
                },
            },
            {
                $project: {
                    _id: 0,
                    communities: 1,
                },
            },
        ]);
    });
}
exports.getUserCommunityList = getUserCommunityList;
function getCommunityUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield communityLink_1.communityLinkModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $unwind: "$users",
            },
        ]);
    });
}
exports.getCommunityUsers = getCommunityUsers;
