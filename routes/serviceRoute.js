"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthenticate_1 = require("../middlewares/userAuthenticate");
const serviceController_1 = require("../controllers/serviceController");
const serviceRoute = express_1.default.Router();
serviceRoute.route("/tiktok").get(userAuthenticate_1.authenticateUser, serviceController_1.getTikTokVideo);
// serviceRoute.route("/detail/")
exports.default = serviceRoute;
