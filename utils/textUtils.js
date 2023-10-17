"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateString = void 0;
function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + "...";
    }
    else {
        return str;
    }
}
exports.truncateString = truncateString;
