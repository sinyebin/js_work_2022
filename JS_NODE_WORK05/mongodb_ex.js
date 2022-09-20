const http = require('http');
const express = require('express');
const app = express();

const MongoClient=require("mongodb").MongoClient;

const dbUrl = 'mongodb://localhost';


app.set('port',process.env.PORT || 3000);

const client = new MongoClient(dbUrl);
let db=null;
async function dbConn(){
    await client.connect();
    db=client.db('vehicle');
    console.log('DB 접속 성공!');
}

app.get('/',async (req, res) => {
    if(db){
        let car = await db.collection('car');
        let carList = await car.find({}).toArray();
        res.send(carList);
    } 
});

app.get('/:carName',async(req,res)=>{
    let carName=req.params.carName;
    if(db){
        let car = await db.collection('car');
        let carList = await car.find({name:carName}).toArray();
        res.send(carList);
    }
});

const server = http.createServer(app);
server.listen(app.get('port'),()=>{
    console.log("서버 실행 >>>localhost: "+app.get('port'));
    dbConn();
})
//dbConn().then(console.log).catch(console.error).finally();
client.close();