const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

const router = express.Router();
// route설정을 끝내고 createServer 전에 미들웨어 등록 해야 한다.

const expressErrorHandler = require('express-error-handler');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

app.set('port', process.env.PORT || 3000);

//쿠키&세션 사용 설정
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(cors());
app.use(express.static('public'));
app.use('/images',express.static('images'));
// bodyparser 미들웨어 등록
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((request, response, next)=>{
    console.log("첫번째 미들웨어");
    //response.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    //response.write("<p>Hi</p>")
    // 다음 미들웨어 요청
    next();
});

app.use('/aa', (request, response, next)=> {
    console.log('/ 요청 미들웨어');
    //response.write("hello ");
    next();
});

//app.get("/", (req, res) => {
router.route('/').get ((req, res) => {
    console.log("GET - / 요청");
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    res.write("<h2>컴스터디 코딩스쿨</h2>");
    res.write('<img src="/images/img01.jpg" />');
    res.end();
});

//app.get("/aa/profile", (req, res) => {
router.route("/profile").get ((req, res) => {
    res.end("<h1>프로필 페이지</h1>");
});

// POST 방식 요청의 파라미터 사용 : bodyparser 미들웨어 등록 후 가능.
// postman 사용해서 테스트 한다.
//app.post('/member/login', (req, res)=>{
router.route('/member/login').post((req, res)=>{
    let userId = req.body.userid;
    let passwd = req.body.passwd;
    console.log("POST - /member/login", {userId, passwd});
    res.send({userId, passwd});
    //res.end();
});

// router 미들웨어 설정 아래의 맨 마지막에 404 오류 페이지 설정
/*app.all("*",(req, res)=>{
   res.status(404).send('<h1>Error - 페이지가 없습니다.'); 
});*/

app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('Running on ', app.get('port') );
})