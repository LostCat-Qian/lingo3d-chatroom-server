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
const ResultJSON_1 = __importDefault(require("../utils/ResultJSON"));
const mapSchema_1 = __importDefault(require("../schema/mapSchema"));
const router = express_1.default.Router();
// 新增地图
router.post('/addMap', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield mapSchema_1.default.validate(body);
        yield new mapSchema_1.default(body).save();
        res.status(200).json(ResultJSON_1.default.SUCCESS(null));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 查询所有地图信息
router.get('/queryAllMaps', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maps = yield mapSchema_1.default.find();
        res.status(200).json(ResultJSON_1.default.SUCCESS(maps));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 获取当前激活的地图信息
router.get('/getCurrentMap', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const map = yield mapSchema_1.default.findOne({
            isCurrentMap: true
        });
        res.status(200).json(ResultJSON_1.default.SUCCESS(map));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
// 切换地图
router.get('/switchMapById', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    // 先将所有的数据的isCurrentMap字段都设置为false
    const maps = yield mapSchema_1.default.find();
    maps.map((item) => (item.isCurrentMap = false));
    for (let i in maps) {
        yield mapSchema_1.default.updateOne({
            _id: maps[i]._id
        }, {
            isCurrentMap: maps[i].isCurrentMap
        });
    }
    try {
        // 将传来的那一项的isCurrentMap设置为true，表示当前激活的地图
        yield mapSchema_1.default.updateOne({
            _id: id
        }, {
            isCurrentMap: true
        });
        res.status(200).json(ResultJSON_1.default.SUCCESS(null));
    }
    catch (err) {
        res.status(500).json(ResultJSON_1.default.SERVER_ERROR());
    }
}));
exports.default = router;
