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
exports.getChats = exports.getUserLatestMessage = exports.getLatestMessage = exports.getuserDmList = void 0;
const DmModel_1 = require("../models/DmModel");
function getuserDmList(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield DmModel_1.DmModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiver",
                    foreignField: "username",
                    as: "messageUser"
                }
            },
        ]);
    });
}
exports.getuserDmList = getuserDmList;
function getLatestMessage(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield DmModel_1.DmModel.aggregate([
            // Match messages where the user is the receiver
            {
                $match: query
            },
            // Add a field to calculate unread status
            {
                $addFields: {
                    unread: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] }
                }
            },
            // Sort messages in descending order of createdAt
            {
                $sort: {
                    createdAt: 1
                }
            },
            //Group by sender and get the last message and unread count from each sender
            {
                $group: {
                    _id: "$sender",
                    lastMessage: { $first: "$text" },
                    createdAt: { $first: "$createdAt" },
                    unreadCount: { $sum: "$unread" }
                }
            },
            // Lookup to get sender details
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "username",
                    as: "messageUser"
                }
            },
            // Project to reshape the output document
            {
                $project: {
                    _id: 0,
                    sender: { $arrayElemAt: ["$messageUser", 0] },
                    lastMessage: 1,
                    createdAt: 1,
                    unreadCount: 1
                }
            }
        ]);
    });
}
exports.getLatestMessage = getLatestMessage;
function sortUserDmResposne(a, b) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (dateA < dateB) {
        return 1;
    }
    if (dateA > dateB) {
        return -1;
    }
    return 0;
}
function getUserLatestMessage(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield DmModel_1.DmModel.aggregate([
            // Match messages where the user is either the sender or receiver
            {
                $match: {
                    $or: [{ sender: username }, { receiver: username }]
                }
            },
            // Sort messages in descending order of createdAt
            {
                $sort: {
                    createdAt: 1
                }
            },
            // Group by sender and receiver to merge messages from both sides
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", username] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $last: "$text" },
                    lastIsRead: { $last: "$isRead" },
                    createdAt: { $last: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ["$receiver", username] }, { $eq: ["$isRead", false] }] }, 1, 0]
                        }
                    }
                }
            },
            // Count unread messages where the current user is the receiver
            {
                $group: {
                    _id: null,
                    conversations: {
                        $push: {
                            _id: "$_id",
                            lastMessage: "$lastMessage",
                            lastIsRead: "$lastIsRead",
                            createdAt: "$createdAt",
                            unreadCount: "$unreadCount"
                        }
                    },
                    totalUnreadCount: { $sum: "$unreadCount" }
                }
            },
            // Lookup to get user details
            {
                $lookup: {
                    from: "users",
                    localField: "conversations._id",
                    foreignField: "username",
                    as: "messageUser"
                }
            },
            // Project to reshape the output document
            {
                $project: {
                    _id: 0,
                    conversations: {
                        $map: {
                            input: "$conversations",
                            as: "conversation",
                            in: {
                                _id: "$$conversation._id",
                                user: { $arrayElemAt: ["$messageUser", { $indexOfArray: ["$messageUser.username", "$$conversation._id"] }] },
                                lastMessage: "$$conversation.lastMessage",
                                lastIsRead: "$$conversation.lastIsRead",
                                createdAt: "$$conversation.createdAt",
                                unreadCount: "$$conversation.unreadCount"
                            }
                        }
                    },
                    totalUnreadCount: 1
                }
            }
        ]);
        const pholder = messages[0];
        if (!pholder) {
            return { totalUnreadCount: 0, conversations: [] };
        }
        const sortedConversation = pholder.conversations.sort(sortUserDmResposne);
        return { totalUnreadCount: pholder.totalUnreadCount, conversations: sortedConversation };
    });
}
exports.getUserLatestMessage = getUserLatestMessage;
function getChats({ sender, receiver }) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield DmModel_1.DmModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender, receiver },
                        { receiver: sender, sender: receiver }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "username",
                    as: "sender"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiver",
                    foreignField: "username",
                    as: "receiver"
                }
            },
            {
                $unwind: "$sender"
            },
            {
                $unwind: "$receiver"
            },
        ]);
    });
}
exports.getChats = getChats;
