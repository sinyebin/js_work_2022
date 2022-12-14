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
const { captureRejectionSymbol } = require('events');
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

function executeDB(db, req, res, callback) {
    if(db) {
        callback(db);
    } else {
        console.log("----- 디비 접속 안됨. ------");
        res.send({
            data : [],
            result: '디비 접속 안됨.'
        });
    }
}

async function getNextSequence(name){
    let count = db.collection('counters');
    let ret = await count.findOneAndUpdate(
        {"_id": name },
        { $inc: { "seq": 1 } }
        
    );
    return ret.value.seq;
}

//app.get("/", (req, res) => {
router.route('/').get((req, res) => {
    console.log("GET - / 요청");
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    res.write("<h2>컴스터디 코딩스쿨</h2>");
    res.end();
});
router.route('/home').get((req, res) =>{
    executeDB(db,req,res,async function(db){
        const photo=db.collection('photo');
        const photoList=await photo.find().toArray();
        req.app.render('home',{photoList},(err,html)=>{
            if(err){
                throw err;
            }
            res.end(html);
        });
    });
    
});

router.route('/add_form').post((req, res) =>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fs.copyFile(files.photo.filepath,"E:/js_work_2022/JS_UPLOAD_PRACTICE/upload/"+ files.photo.originalFilename,(err)=>{
            fs.unlink(files.photo.filepath, (err) => {});
                if (err) console.log(err)
        });
        executeDB(db,req,res,async function(db){
            let num=await getNextSequence("userid");
            let photoUpdate = {
                no:num,
                id:fields.id,
                name:fields.name,
                email:fields.email,
                photo:"/upload/"+files.photo.originalFilename,
                pw:fields.pw
            }
            let photo = db.collection('photo');
            let result=await photo.insert(photoUpdate);
            const photoList=await photo.find().toArray();
            req.app.render('home',{photoList},(err,html)=>{
                if(err){
                    throw err;
                }
                res.end(html);
            });
        });
        
    });

    
});

router.route("/delete").post((req,res)=>{
    executeDB(db,req,res,async function(db){
        let deletepw=String(req.body.deletepw); 
        let deleteno=parseInt(req.body.deleteno);
        let photo = db.collection('photo');
        let result = await photo.deleteOne({"no":deleteno,"pw":deletepw});
        console.log(">>>result:"+ result);
        const photoList=await photo.find().toArray();
        req.app.render('home',{photoList},(err,html)=>{
            if(err){
                throw err;
            }
            res.end(html);
        });
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
    dbConn();
});