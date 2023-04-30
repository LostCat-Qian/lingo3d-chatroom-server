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
const express_1 = __importDefault(require("express"));
const announcementSchema_1 = __importDefault(require("../schema/announcementSchema"));
const ResultJSON_1 = __importDefault(require("../utils/ResultJSON"));
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.send('respond with a resource')
    res.json({
        tip: 'success'
    });
});
// 推送新公告
router.post('/addNewAnnouncement', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    if (body.title === '') {
        res.status(400).json(ResultJSON_1.default.BAD_REQUEST('参数 title 未填写'));
    }
    try {
        new announcementSchema_1.default({
            title: body.title,
            content: body.content,
            date: new Date().getTime()
        }).save();
        res.status(200).json(ResultJSON_1.default.SUCCESS('公告添加成功'));
    }
    catch (err) {
        res.status(400).json(ResultJSON_1.default.BAD_REQUEST());
    }
}));
// 获取公告消息
router.get('/getAnnouncements', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcements = yield announcementSchema_1.default.find();
        res.status(200).json(ResultJSON_1.default.SUCCESS(announcements));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 删除公告消息
router.get('/delAnnouncement', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield announcementSchema_1.default.deleteOne({
            _id: req.query.id
        });
        res.status(200).json(ResultJSON_1.default.SUCCESS('删除成功'));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
exports.default = router;
