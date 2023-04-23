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
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const ResultJSON_1 = __importDefault(require("../utils/ResultJSON"));
const tokenUtil_1 = require("../utils/tokenUtil");
const router = express_1.default.Router();
// 获取所有用户的信息
router.get('/getUsersInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userSchema_1.default.find();
        res.status(200).json(ResultJSON_1.default.SUCCESS(users));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 更新用户信息
router.post('/updateUserInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    try {
        userSchema_1.default.findOneAndUpdate({
            _id: body._id
        }, {
            nickname: body.nickname,
            password: body.password
        });
        res.status(200).json(ResultJSON_1.default.SUCCESS('update success'));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 登录接口
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    console.log(body);
    let user;
    try {
        user = yield userSchema_1.default.findOne({
            username: (_a = body.username) !== null && _a !== void 0 ? _a : '',
            password: (_b = body.password) !== null && _b !== void 0 ? _b : ''
        });
        const token = (0, tokenUtil_1.createToken)({
            username: user.username,
            password: user.password,
            nickname: user.nickname
        });
        res.status(200).json(ResultJSON_1.default.SUCCESS({
            token: token,
            nickname: user.nickname,
            username: user.username
        }));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 注册接口
router.post('/regist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    if (body.username === '' || body.password === '' || body.nickname === '') {
        return res.status(400).json(ResultJSON_1.default.BAD_REQUEST());
    }
    const nicknameExist = yield userSchema_1.default.find({
        nickname: body.nickname
    });
    const usernameExist = yield userSchema_1.default.find({
        username: body.username
    });
    console.log(nicknameExist, usernameExist);
    if (nicknameExist.length !== 0 || usernameExist.length !== 0) {
        return res.status(400).json(ResultJSON_1.default.BAD_REQUEST('用户名或昵称已存在'));
    }
    try {
        new userSchema_1.default({
            username: body.username,
            password: body.password,
            nickname: body.nickname
        }).save();
        res.status(200).json(ResultJSON_1.default.SUCCESS({
            info: 'regist success'
        }));
    }
    catch (err) {
        res.status(400).json(ResultJSON_1.default.BAD_REQUEST());
    }
}));
exports.default = router;
