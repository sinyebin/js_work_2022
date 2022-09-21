const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const socketio = require('socket.io');

app.set('port', process.env.PORT||3000);
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`http://localhost:${app.get('port')}`);
});
// 이전 버전의 socketio.listen() 대신 그냥 socketio() 사용
const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});

io.sockets.on('connection', (socket)=>{
    console.log('소켓 요청 들어옴.');
});