const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
// route설정을 끝내고 createServer 전에 미들웨어 등록 해야 한다.
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const formidable = require('formidable');
const fs=require('fs');
const { executionAsyncResource } = require('async_hooks');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost';

app.set('port', process.env.PORT || 3000);
// 쿠키&세션 사용 설정
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use(cors());
app.use('/images',express.static('images'));
app.use('/upload', express.static('upload'));
app.use(express.static('public'));
app.set("view engine", "ejs");

// bodyparser 미들웨어 등록
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let db = null;

const client = new MongoClient(dbUrl);
async function dbConn() {
    await client.connect();
    db = client.db('vehicle');
    console.log('>>>>> DB 접속 성공!');
}

//app.get("/", (req, res) => {
router.route('/').get((req, res) => {
    console.log("GET - / 요청");
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    res.write("<h2>컴스터디 코딩스쿨</h2>");
    res.end();
});
var num=0;
var photoList=[
]
var id="";
var name="";
var email="";
var photo="";
var pw="";
router.route('/home').get((req, res) =>{
    req.app.render('home',{photoList},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
    }); 
});

router.route('/add_form').post((req, res) =>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fs.copyFile(files.photo.filepath,"E:/js_work_2022/JS_UPLOAD_PRACTICE/upload/"+ files.photo.originalFilename,(err)=>{
            fs.unlink(files.photo.filepath, (err) => {});
                if (err) console.log(err)
        });
        photo="/upload/"+files.photo.originalFilename;
        id=fields.id;
        name=fields.name;
        email=fields.email;
        pw=fields.pw;
        photoList.push({no:num, id:id, name:name, email:email, photo:photo, pw:pw});
        num++;
        req.app.render('home',{photoList},(err,html)=>{
            if(err){
                throw err;
            }
            res.end(html);
        });
    });
   //res.send(photoList); 
    
});

router.route("/delete").post((req,res)=>{
    let deletepw=req.body.deletepw; 
    let deleteno=req.body.deleteno;
    let check=0;
    for(var i=0;i<photoList.length;i++){
        if(photoList[i].no==deleteno){
            check=i;
        }
    }
    if(deletepw===photoList[check].pw){
        photoList.splice(check,1);
        console.log("삭제");
    }else{
        console.log("비밀번호가 다릅니다.");
    }
    req.app.render('home',{photoList},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
    });
});

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
});