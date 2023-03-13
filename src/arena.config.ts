import Arena from '@colyseus/arena'
import { monitor } from '@colyseus/monitor'
import { MyRoom } from './rooms/MyRoom'

// socket.io
const socketIO = require('socket.io')
import { Socket } from 'socket.io/dist/socket'
const http = require('http')
// 路由
const accounts = require('./routes/accounts')

export default Arena({
  getId: () => 'Your Colyseus App',

  initializeGameServer: (gameServer) => {
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

    app.use('/colyseus', monitor())
    app.use('/user', accounts)

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
