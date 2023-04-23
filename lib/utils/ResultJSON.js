"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResultJSON {
    static selectState(status, data, msg) {
        return {
            status: status,
            message: msg,
            data: data
        };
    }
    static SUCCESS(data) {
        return this.selectState(200, data, 'Success');
    }
    static NOT_FOUND(data) {
        return this.selectState(404, data, 'Not Found');
    }
    static NO_AUTHORIZATION() {
        return this.selectState(401, null, 'No Authorization');
    }
    static BAD_REQUEST(msg = 'Bad Request') {
        return this.selectState(400, null, msg);
    }
    static SERVER_ERROR() {
        return this.selectState(500, null, 'Server Error');
    }
}
exports.default = ResultJSON;
