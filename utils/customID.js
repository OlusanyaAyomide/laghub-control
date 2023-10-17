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
exports.generateRandomNumbers = exports.generateUniqueID = void 0;
function generateUniqueID(model, unique) {
    return __awaiter(this, void 0, void 0, function* () {
        const maxAttempts = 10;
        let attempt = 0;
        while (attempt < maxAttempts) {
            const randomID = Math.floor(1000000 + Math.random() * 9000000).toString();
            const existingDocument = yield model.findOne({ customId: randomID });
            if (!existingDocument) {
                return `${unique}-${randomID}`;
            }
            attempt++;
        }
        throw new Error("Failed to generate a unique ID");
    });
}
exports.generateUniqueID = generateUniqueID;
function generateRandomNumbers(length) {
    const characters = '0123456789';
    const randomString = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    return randomString;
}
exports.generateRandomNumbers = generateRandomNumbers;
