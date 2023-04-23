"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const useMongoDB_1 = __importDefault(require("../utils/useMongoDB"));
mongoose_1.default.connect(useMongoDB_1.default);
const Schema = mongoose_1.default.Schema;
// 设计用户的字段
const userSchema = new Schema({
    createDate: {
        type: Date,
        default: new Date().getTime()
    },
    nickname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    extend: {
        type: Object,
        default: {}
    }
});
exports.default = mongoose_1.default.model('User', userSchema);
