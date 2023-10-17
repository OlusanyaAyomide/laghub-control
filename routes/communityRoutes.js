"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthenticate_1 = require("../middlewares/userAuthenticate");
const commnityValidation_1 = require("../validations/commnityValidation");
const communityController_1 = require("../controllers/communityController");
const communityRoutes = express_1.default.Router();
communityRoutes.route("/active").get(userAuthenticate_1.authenticateUser, communityController_1.mostActiveCommunities);
communityRoutes.route("/create").post(userAuthenticate_1.authenticateUser, commnityValidation_1.validateCommunityCreate, communityController_1.newCommunity);
communityRoutes.route("/message").post(userAuthenticate_1.authenticateUser, communityController_1.communityMessage);
communityRoutes.route("/join-community").post(userAuthenticate_1.authenticateUser, communityController_1.JoinCommunity);
communityRoutes.route("/:slug").get(userAuthenticate_1.authenticateUser, communityController_1.communityDetail);
communityRoutes.route("/users/:customId").get(userAuthenticate_1.authenticateUser, communityController_1.communityUsers);
exports.default = communityRoutes;
