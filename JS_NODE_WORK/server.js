const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get("/", function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write("<h3>컴스터디 스쿨에 오신것을 환영합니다</h3>");
    res.write("<h1>Comstudy School</h1>");
    let user = "홍길동";
    res.write(`${user}님 반갑습니다.`);
    res.end();
});

app.get("/profile/:user", function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write("<h3>프로필입니다</h3>");
    res.write("<h1>프로필 소개</h1>");
    let user = req.params.user;
    res.write(`${user}님 반갑습니다.`);
    res.end();
});

app.get("/calc/:operator/:a/:b", function(req, res) {
    let result = 0;
    let a=Number(req.params.a);
    let b=Number(req.params.b);
    switch(req.params.operator) {
        case "plus" : result = a + b; break;
        case "minus" : result = a - b; break;
        case "multiply" : result = a * b; break;
        case "divide" : result = a / b; break;
    }
    console.log(result);
    res.send({result});
});


const server = http.createServer(app);
server.listen(3000, ()=>{
    console.log('Listening on port 3000');
});