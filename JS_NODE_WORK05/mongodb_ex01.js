const MongoClient=require("mongodb").MongoClient;

const dbUrl = 'mongodb://localhost';
const conn = MongoClient.connect(dbUrl,function(err,client){
    if(err) throw err;
    var db=client.db('vehicle');
    console.log(db);
});