"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arena_1 = __importDefault(require("@colyseus/arena"));
const monitor_1 = require("@colyseus/monitor");
const MyRoom_1 = require("./rooms/MyRoom");
// socket.io
const socketIO = require('socket.io');
const http = require('http');
// 路由
const users_1 = __importDefault(require("./routes/users"));
const announcement_1 = __importDefault(require("./routes/announcement"));
exports.default = (0, arena_1.default)({
    getId: () => 'Your Colyseus App',
    initializeGameServer: (gameServer) => {
        gameServer.define('my_room', MyRoom_1.MyRoom);
    },
    initializeExpress: (app) => {
        const PORT = 3000;
        const server = http.createServer(app);
        const io = socketIO(server, {
            cors: {
                origin: '*'
            }
        });
        const nowAllUsers = [];
        // 设置路由白名单
        // const whiteList = ['/user/login']
        // app.use((req: Request, res: Response, next) => {
        //   if (!whiteList.includes(req.url)) {
        //     verifyToken(req.headers.authorization as string)
        //       .then((res) => {
        //         next()
        //       })
        //       .catch((e) => {
        //         res.status(401).json(ResultJSON.NO_AUTHORIZATION())
        //       })
        //   } else {
        //     next()
        //   }
        // })
        app.use('/colyseus', (0, monitor_1.monitor)());
        app.use('/user', users_1.default);
        app.use('/announcement', announcement_1.default);
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
