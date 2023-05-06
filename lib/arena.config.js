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
const arena_1 = __importDefault(require("@colyseus/arena"));
const monitor_1 = require("@colyseus/monitor");
const MyRoom_1 = require("./rooms/MyRoom");
const colyseus_1 = require("colyseus");
const tokenUtil_1 = require("./utils/tokenUtil");
const ResultJSON_1 = __importDefault(require("./utils/ResultJSON"));
// 开启流媒体服务器
const node_media_server_1 = __importDefault(require("node-media-server"));
const config = {
    rtmp: {
        port: 7725,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        mediaroot: './media',
        allow_origin: '*'
    }
};
// socket.io
const socketIO = require('socket.io');
const http_1 = __importDefault(require("http"));
// 路由
const users_1 = __importDefault(require("./routes/users"));
const announcement_1 = __importDefault(require("./routes/announcement"));
const map_1 = __importDefault(require("./routes/map"));
exports.default = (0, arena_1.default)({
    getId: () => 'Your Colyseus App',
    initializeGameServer: (gameServer) => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield colyseus_1.matchMaker.createRoom("battle", { mode: "duo" });
        console.log(room);
        gameServer.define('my_room', MyRoom_1.MyRoom);
    }),
    initializeExpress: (app) => {
        const PORT = 3000;
        const server = http_1.default.createServer(app);
        const io = socketIO(server, {
            cors: {
                origin: '*'
            }
        });
        const nowAllUsers = [];
        // 启动流媒体服务器
        const nms = new node_media_server_1.default(config);
        nms.run();
        // 设置路由白名单
        const whiteList = ['/user/login', '/user/regist', '/user/adminLogin', '/map/getCurrentMap', '/announcement/getAnnouncements'];
        // 全局拦截除白名单以外的请求
        app.use((req, res, next) => {
            if (!whiteList.includes(req.url)) {
                (0, tokenUtil_1.verifyToken)(req.headers.authorization)
                    .then((res) => {
                    next();
                })
                    .catch((e) => {
                    res.status(401).json(ResultJSON_1.default.NO_AUTHORIZATION());
                });
            }
            else {
                next();
            }
        });
        app.use('/colyseus', (0, monitor_1.monitor)());
        app.use('/user', users_1.default);
        app.use('/announcement', announcement_1.default);
        app.use('/map', map_1.default);
        io.on('connection', (socket) => {
            let username = '';
            socket.on('enter', (webUsername) => {
                username = webUsername;
                const user = nowAllUsers.find((item) => item === username);
                if (user) {
                    socket.emit('userExist', {
                        status: 404,
                        msg: '用户名已存在！'
                    });
                    return;
                }
                else {
                    nowAllUsers.push(username);
                    io.emit('userEnter', username);
                    io.emit('userList', nowAllUsers);
                    io.emit('userCount', nowAllUsers.length);
                }
            });
            socket.on('sendMessage', (data) => {
                io.emit('sendServerMsg', data);
            });
            socket.on('audio', ({ blob, id }) => {
                console.log(blob);
                io.emit('audio', {
                    id,
                    blob
                });
            });
            socket.on('disconnect', () => {
                const index = nowAllUsers.findIndex((item) => item === username);
                nowAllUsers.splice(index, 1);
            });
        });
        server.listen(PORT, () => {
            console.log('Socket.io listening in port 3000...');
        });
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
