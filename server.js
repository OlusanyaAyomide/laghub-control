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
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const conn_1 = __importDefault(require("./config/conn"));
const socket_io_1 = require("socket.io");
const validateFromuser_1 = require("./middlewares/validateFromuser");
const SocketDispatcher_1 = require("./sockets/SocketDispatcher");
dotenv_1.default.config();
const server = http_1.default.createServer(app_1.default);
const PORT = process.env.PORT || 5000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
app_1.default.set("port", PORT);
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const socketToken = socket.handshake.auth.token;
    if (!socketToken) {
        next(new Error("thou shall not pass"));
    }
    const user = yield (0, validateFromuser_1.authenticateSocket)(socketToken);
    console.log(user, "user result");
    if (!user) {
        return next(new Error("Token invalid"));
    }
    socket.data.user = user;
    next();
}));
(0, conn_1.default)()
    .then(() => {
    console.log("Connected to db");
    try {
        server.listen(PORT, () => console.log(`Server listening & database connected on ${PORT}`));
    }
    catch (e) {
        console.log('Cannot connect to the server');
    }
})
    .catch((e) => {
    console.log('Invalid database connection...! ', e);
});
io.on("connection", (socket) => {
    (0, SocketDispatcher_1.socketDispatcher)(socket);
});
exports.default = io;
