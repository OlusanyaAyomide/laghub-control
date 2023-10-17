"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const getTiktoktoken_1 = require("./getTiktoktoken");
const onRequest = (config) => {
    const { method, url } = config;
    config.headers['X-RapidAPI-Key'] = (0, getTiktoktoken_1.gettikTokToken)();
    config.headers['X-RapidAPI-Host'] = 'tiktok-video-no-watermark2.p.rapidapi.com';
    return config;
};
const onResponse = (response) => {
    const { method, url } = response.config;
    const { status } = response;
    return response;
};
const onErrorResponse = (error) => {
    var _a;
    if (axios_1.default.isAxiosError(error)) {
        const { message } = error;
        const { method, url } = error.config;
        const { statusText, status } = (_a = error.response) !== null && _a !== void 0 ? _a : {};
        console.log(`${method === null || method === void 0 ? void 0 : method.toUpperCase()} ${url} | Error ${status} ${message}`);
        if (status === 401) {
            console.log("LogIn Required");
        }
    }
    return Promise.reject(error);
};
const baseURL = "https://tiktok-video-no-watermark2.p.rapidapi.com/feed/search";
const request = axios_1.default.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});
request.interceptors.request.use(onRequest, onErrorResponse);
request.interceptors.response.use(onResponse, onErrorResponse);
exports.default = request;
