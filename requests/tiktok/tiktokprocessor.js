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
exports.tiktokProcessor = void 0;
const tiktokrequest_1 = __importDefault(require("./tiktokrequest"));
const constants_1 = require("../../config/constants");
const getRandomKey = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
function tiktokProcessor(page) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let newpage = page;
        const sortedBy = [0, 1, 3];
        let response = null;
        while (!response) {
            console.log("In loop");
            const url = `?keywords=${getRandomKey(constants_1.keywords)}&count=10&publish_time=${30}&sort_type=${getRandomKey(sortedBy)}&cursor=${newpage}`;
            console.log(url);
            try {
                const res = yield tiktokrequest_1.default.get(url);
                console.log((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.hasMore);
                if ((_b = res.data.data) === null || _b === void 0 ? void 0 : _b.hasMore) {
                    response = res.data;
                }
                else {
                    newpage = "1";
                }
            }
            catch (err) {
                console.log(err);
                return null;
            }
        }
        return response.data;
    });
}
exports.tiktokProcessor = tiktokProcessor;
