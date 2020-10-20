import io from 'socket.io-client'

// please note change to offcial url while app testing and do not change port number 3000
const socket = io("exp://192.168.1.86:19000", {
  transports: ['websocket']
});

export default class MessageSocket {
    constructor() {
        if (!this.socket) {
            this.socket = socket;
        }
    }
}