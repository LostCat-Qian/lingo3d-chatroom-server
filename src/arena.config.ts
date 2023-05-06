import Arena from '@colyseus/arena'
import { monitor } from '@colyseus/monitor'
import { MyRoom } from './rooms/MyRoom'
import { matchMaker } from 'colyseus'
import { NextFunction, Request, Response } from 'express'
import { verifyToken } from './utils/tokenUtil'
import ResultJSON from './utils/ResultJSON'

// 开启流媒体服务器
import NodeMediaServer from 'node-media-server'
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
}

// socket.io
const socketIO = require('socket.io')
import { Socket } from 'socket.io/dist/socket'
import http from 'http'

// 路由
import userRouter from './routes/users'
import announcementRouter from './routes/announcement'
import mapRouter from './routes/map'

export default Arena({
  getId: () => 'Your Colyseus App',

  initializeGameServer: async (gameServer) => {
    gameServer.define('private_room', MyRoom)
    gameServer.define('my_room', MyRoom)
  },

  initializeExpress: (app) => {
    const PORT = 3000
    const server = http.createServer(app)
    const io = socketIO(server, {
      cors: {
        origin: '*'
      }
    })
    const nowAllUsers: string[] = []

    // 启动流媒体服务器
    const nms = new NodeMediaServer(config)
    nms.run()

    // 设置路由白名单
    const whiteList = ['/user/login', '/user/regist', '/user/adminLogin', '/map/getCurrentMap', '/announcement/getAnnouncements']
    // 全局拦截除白名单以外的请求
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (!whiteList.includes(req.url)) {
        verifyToken(req.headers.authorization as string)
          .then((res) => {
            next()
          })
          .catch((e) => {
            res.status(401).json(ResultJSON.NO_AUTHORIZATION())
          })
      } else {
        next()
      }
    })

    app.use('/colyseus', monitor())
    app.use('/user', userRouter)
    app.use('/announcement', announcementRouter)
    app.use('/map', mapRouter)

    io.on('connection', (socket: Socket) => {
      let username = ''
      socket.on('enter', (webUsername: string) => {
        username = webUsername
        const user = nowAllUsers.find((item) => item === username)

        if (user) {
          socket.emit('userExist', {
            status: 404,
            msg: '用户名已存在！'
          })
          return
        } else {
          nowAllUsers.push(username)
          io.emit('userEnter', username)
          io.emit('userList', nowAllUsers)
          io.emit('userCount', nowAllUsers.length)
        }
      })

      socket.on('sendMessage', (data) => {
        io.emit('sendServerMsg', data)
      })

      socket.on('audio', ({ blob, id }) => {
        console.log(blob)
        io.emit('audio', {
          id,
          blob
        })
      })

      socket.on('disconnect', () => {
        const index = nowAllUsers.findIndex((item) => item === username)
        nowAllUsers.splice(index, 1)
      })
    })

    server.listen(PORT, () => {
      console.log('Socket.io listening in port 3000...')
    })
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  }
})
