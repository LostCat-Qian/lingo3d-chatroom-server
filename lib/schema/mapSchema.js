"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const useMongoDB_1 = __importDefault(require("../utils/useMongoDB"));
mongoose_1.default.connect(useMongoDB_1.default);
mongoose_1.default.set('useFindAndModify', false);
const Schema = mongoose_1.default.Schema;
const mapSchema = new Schema({
    src: {
        type: String,
        required: true
    },
    roughness: {
        type: Number,
        required: true
    },
    metalness: {
        type: Number,
        required: true
    },
    scale: {
        type: Number,
        required: true
    },
    isCurrentMap: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model('Map', mapSchema);
