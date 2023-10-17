"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthenticate_1 = require("../middlewares/userAuthenticate");
const postController_1 = require("../controllers/postController");
const postValidation_1 = require("../validations/postValidation");
const postRoutes = express_1.default.Router();
postRoutes.route("/create").post(userAuthenticate_1.authenticateUser, postValidation_1.validateCreatePost, postController_1.postCreate);
postRoutes.route("/all").get(userAuthenticate_1.authenticateUser, postController_1.postGetAll);
postRoutes.route("/like").post(userAuthenticate_1.authenticateUser, postValidation_1.validateLikePost, postController_1.postLike);
postRoutes.route("/create-message").post(userAuthenticate_1.authenticateUser, postValidation_1.validateCreateMessage, postController_1.messageCreate);
postRoutes.route("/create-reply").post(userAuthenticate_1.authenticateUser, postValidation_1.validateCreatereply, postController_1.replyCreate);
postRoutes.route("/detail/:customId").get(userAuthenticate_1.authenticateUser, postController_1.postDetail);
// postRoutes.route("/detail/")
exports.default = postRoutes;
