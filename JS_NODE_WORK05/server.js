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
var fs = require('fs');
// 파일 업로드 기능
const multer = require('multer');
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
app.use('/files', express.static(__dirname + '/images'));
app.use('/upload', express.static(__dirname + '/upload'));
app.use(express.static('public'));

// bodyparser 미들웨어 등록
app.use(express.json());
app.use(express.urlencoded({extended:true}));

var storage = multer.diskStorage({
    destination : function(req, file,callback) {
        callback(null, 'upload');
    },
    filename : function(req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
    }
});
// 파일 제한 : 최대 10개, 1G이하
var upload = multer({
    storage : storage,
    limits : {
        files: 10,
        fileSize : 1024 * 1024 * 1024
    }
});

let db = null;

const client = new MongoClient(dbUrl);
async function dbConn() {
    await client.connect();
    db = client.db('vehicle');
    console.log('>>>>> DB 접속 성공!');
}

router.route('/').get((req, res) => {
    console.log("GET - / 요청");
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    res.write("<h2>컴스터디 코딩스쿨</h2>");
    res.end();
});


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

const carListHandler = (req, res) => {
    executeDB(db, req, res, async function(db) {
        const car = db.collection('car');
        const list = await car.find().toArray();
        res.send(list);
    });
};

const carInputHandler = (req, res) => {
    executeDB(db, req, res, async function(db) {
        let carData = {
            name : req.body.name,
            price : req.body.price,
            company : req.body.company,
            year : req.body.year
        };
        let car = db.collection('car');
        let result = await car.insert(carData);
        console.log(">>>>> result : " + result);
        res.send(carData);
    });
};

const carDeleteHandler = (req, res) => {
    executeDB(db, req, res, async function(db) {
        let name = req.body.name;
        let car = db.collection('car');
        let result = await car.deleteOne({"name":name});
        console.log(">>>result:"+ result);
        res.send(name);
    });
};

const carUpdateHandler = (req, res) => {
    executeDB(db, req, res, async function(db) {
        let carData = {
            name : req.body.name,
            price : req.body.price,
            company : req.body.company,
            year : req.body.year
        };
        let car = db.collection('car');
        let result= await car.update({name:carData.name},[{$set:{price:carData.price,company:carData.company,year:carData.year}}]);
        console.log(">>>result: " + result);
        res.send(carData);
    });
};

router.route('/car').get(carListHandler);

router.route('/car').post(carInputHandler);

router.route('/car').put(carUpdateHandler);

router.route('/car').delete(carDeleteHandler);

//// -----------------------------------
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