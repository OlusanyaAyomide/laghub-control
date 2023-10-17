"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    // Success Response Handler
    static sendSuccessResponse({ res, code = 200, message = 'Operation Successful', data = null, custom = false, }) {
        const response = custom && data ? Object.assign({}, data) : { success: true, code: code, message, data };
        return res.status(code).json(response);
    }
    // Error Response Handler
    static sendErrorResponse({ res, code = 400, error = 'Operation failed', custom = false, }) {
        const response = custom ? { code: code, message: error } : { success: false, code: code, message: error };
        return res.status(code).json(response);
    }
}
exports.default = ResponseHandler;
