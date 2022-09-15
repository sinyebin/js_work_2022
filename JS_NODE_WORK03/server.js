const http = require('http');
const express = require('express');
const { error } = require('console');
const app = express();

//app.set('post', 3000);
// a += 10; --> a = a + 10;
// process.env.PORT != false && process.env.PORT : 3000;
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");

// 리소스 폴더 추가 (serve-static)
app.use(express.static('public'));

// req: request, res: response
app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write('<html><body>');
    res.write('<h1>길동이의 홈페이지</h1>');
    res.write('<li><a href="/home">Home으로 이동</a></li>');
    res.write('<li><a href="/carList">carList 이동</a></li>');
    res.write('<li><a href="/carList.html">carList.html 이동</a></li>');
    res.write('</hr>');
    res.write('<li><a href="/home2">Home2으로 이동</a></li>');
    res.write('<li><a href="/carList2">carList2 이동</a></li>');
    res.write('<li><a href="/carList2.html">carList2.html 이동</a></li>');
    res.write('</body></html>');
    res.end(); // close 하지 않으면 무한루프 됨.
});

let dataObject = {
    message: "Gildong shop",
    carList: ['Sonata','Grandeur','Santafe']
}
let carList=[
    {no:1, name:'Sonata', price:2500, company: 'HUNDAI', year:2020},
    {no:2, name:'Grandeur', price:3500, company: 'HUNDAI', year:2022},
    {no:3, name:'K7', price:3500, company: 'KIA', year:2021},
    {no:4, name:'5520', price:9500, company: '벤츠', year:2019},
]
app.get('/carList', (req, res) => {
    res.send(dataObject);
});
app.get('/carList2',function(req, res){
    res.send({carList}); 
});
app.get('/home', function(req, res) {
    // ejs 모듈 설치 - npm install ejs --save
    // (설치 확인 명령 : npm list --depth=0)
    // ejs views 설정 - app.set("view engine", "ejs");
    // ejs 폴더 설정(디폴트) - app.set("views", __dirname + '/views');
    // ejs 뷰엔진으로 렌더링 - req.app.render();
    req.app.render('home', dataObject, (err, html)=>{
        if(err) {
            throw err;
        }
        res.end(html);
    });
});
app.get("/detail/:no",function(req, res){
    let no=req.params.no;
    let car=carList[no-1];
    req.app.render('detail',{car},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
    });
});

app.get('/home2', function(req, res) {
    let carDataObj = {
        message: "Gildong shop",
        carList: carList
    }
    req.app.render('home2', carDataObj, (err, html)=>{
        if(err) {
            throw err;
        }
        res.end(html);
    });
});


const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('Listening on port: ' + app.get('port'));
});