const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const socketio = require('socket.io');
const e = require('express');

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


  
  
const socketMapper = new Map();

io.sockets.on('connection', (socket)=>{
    console.log('소켓 요청 들어옴.');
    socket.on('news', function(data) {
        //console.log(data);
        //socket.emit('msg', {my :"way"});
    });

    socket.on('login', function(data, callback){
        //console.log(data);
        callback('서버 메세지: '+data.userId+' 접속 완료!');
        //console.log(socket.id);
        // 이전 방식
        //console.log(io.sockets.connected[socket.id]);
        // 현재 방식
        //console.dir(io.sockets.sockets.get(socket.id) === socket);
        if(socketMapper.has(data.userId)){
            socket.emit('login_check', {"login":"fail"});
        }else{
            socket.emit('login_check', {"login":"pass"});
            socketMapper.set(data.userId,socket.id);
            socket.userId = data.userId;
        }
        
        //console.log(socketMapper);
    });
    socket.on('message', (data)=>{
        //socket.emit('message', data);
        // 모든 접속자에게 메세지 보내기
        if(data.recepient=="All"){
            socket.broadcast.emit('message', data);
        }else{
            io.to(socketMapper.get(data.recepient)).emit('message', data);
        }
        
        console.log(data);
    })

    socket.on('disconnect', function(){
        for (var [key, value] of socketMapper) {
            if(value===socket.id){
                socketMapper.delete(key);
            }
        }
        console.log(socketMapper);
        console.log('클라이언트 나감!');
    });
});