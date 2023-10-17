"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/communityRoutes"));
const serviceRoute_1 = __importDefault(require("./routes/serviceRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1/user', authRoutes_1.default);
app.use('/api/v1/post', postRoutes_1.default);
app.use('/api/v1/community', communityRoutes_1.default);
app.use("/api/v1/service", serviceRoute_1.default);
app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
