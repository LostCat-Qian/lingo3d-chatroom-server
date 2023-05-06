"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const colyseus_1 = require("colyseus");
const MyRoomState_1 = require("./schema/MyRoomState");
// interface RoomType extends Map<string, any> {
//   roomId: string
//   roomState: Map<string, MyRoomState>
// }
class MyRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        // private roomMap: RoomType = {}
        this.roomMap = [];
    }
    onCreate(options) {
        const roomState = new MyRoomState_1.MyRoomState();
        this.setState(roomState);
        // console.log(this.roomId, 'RoomID')
        // console.log(options)
        // this.roomMap.set(this.roomId, {
        //   userId: 1,
        //   MyRoomState
        // })
        this.roomMap.push({
            roomId: this.roomId
        });
        this.onMessage('updatePlayer', (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (!player) {
                return;
            }
            Object.assign(player, data);
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, 'joined!');
        const player = new MyRoomState_1.Player();
        this.state.players.set(client.sessionId, player);
    }
    onLeave(client, consented) {
        console.log(client.sessionId, 'left!');
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}
exports.MyRoom = MyRoom;
