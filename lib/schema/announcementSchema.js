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
const announcementSchema = new Schema({
    date: {
        type: Date,
        default: new Date().getTime()
    },
    title: {
        type: String,
        require: true,
        default: '暂无公告'
    },
    content: {
        type: String,
        require: true,
        default: '暂无公告，请留意后续消息'
    },
    extend: {
        type: Object,
        default: {}
    }
});
exports.default = mongoose_1.default.model('Announcement', announcementSchema);
