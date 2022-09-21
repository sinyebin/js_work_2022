const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

const router = express.Router();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.static('public'));
router.route('/count').get((req, res)=>{
    count++;
    res.send({
        count: count,
        date : new Date()
    });
});

let count = 0;
router.route('/count/:count').get((req, res)=>{
    console.log("GET = / 요청 됨.");
    let clientCount = Number(req.params.count);
    if(clientCount != count) {
        res.send({
            count: count,
            date : new Date()
        });
    } else {
        res.end();
    }
});

app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`http://localhost:${app.get('port')}`);
});