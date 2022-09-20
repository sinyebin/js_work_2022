const http = require('http');
const express = require('express');
const app = express();

const MongoClient=require("mongodb").MongoClient;

const dbUrl = 'mongodb://localhost';
const client = new MongoClient(dbUrl);

app.set('port',process.env.PORT || 3000);

async function dbConn(){
    await client.connect();
    console.log('DB 접속 성공!');
    const db=client.db('vehicle');
    console.log(db);
    const car = db.collection('car');
    const carDoc=await car.findOne();
    console.log(carDoc);
}

const server = http.createServer(app);
server.listen(app.get('port'),()=>{
    console.log("서버 실행: ",app.get('port'));

    dbConn().then(console.log).catch(console.error).finally();
})

//dbConn().then(console.log).catch(console.error).finally(()=>client.close());
