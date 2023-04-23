"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const secretKey_1 = __importDefault(require("../utils/secretKey"));
// 生成token
// info也就是payload是需要存入token的信息
function createToken(info) {
    let token = jsonwebtoken_1.default.sign(info, secretKey_1.default, {
        //Token有效时间 单位s
        expiresIn: 24 * 60 * 60
    });
    return token;
}
exports.createToken = createToken;
// 验证 Token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey_1.default, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.verifyToken = verifyToken;
// 解码 token
function decodeJWT(token) {
    return (0, jwt_decode_1.default)(token);
}
exports.decodeJWT = decodeJWT;
