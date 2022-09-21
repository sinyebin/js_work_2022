const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

const router = express.Router();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.static('public'));

var messages = [];
app.get("/recieve", function(req, resp) {
    if(req.query.size >= messages.length){
        resp.end();
    } else {
        var res = {
            total: messages.length,
            messages: messages.slice(req.query.size)
        }
        resp.end(JSON.stringify(res));
    }
});
app.get("/send", function(req, resp) {
    messages.push({
        sender: req.query.sender,
        message: req.query.message
    });
    reps.end()
});


app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`http://localhost:${app.get('port')}`);
});