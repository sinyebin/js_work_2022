const http = require('http');
const express = require('express');
const { error } = require('console');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write('<html><body>');
    res.write('<h1>길동이의 홈페이지</h1>');
    res.write('<li><a href="/home">Home으로 이동</a></li>');
    res.write('<li><a href="/carList">carList 이동</a></li>');
    res.write('</body></html>');
    res.end(); 
});
var num=5;
let carList=[
    {no:1, name:'Sonata', price:2500, company: 'HUNDAI', year:2020},
    {no:2, name:'Grandeur', price:3500, company: 'HUNDAI', year:2022},
    {no:3, name:'K7', price:3500, company: 'KIA', year:2021},
    {no:4, name:'5520', price:9500, company: '벤츠', year:2019},
]
let dataObject = {
    message: "Gildong shop",
    carList: carList
}
app.get('/carList',(req,res)=>{
    req.app.render('carList',{carList},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
   }); 
});

app.get('/home',(req,res)=>{
   req.app.render('home',dataObject,(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
   }); 
});

app.get("/detail/:no",function(req, res){
    let no=req.params.no;
    let check=0;
    for(var i=0;i<carList.length;i++){
        if(carList[i].no==no){
            check=i;
        }
    }
    let car=carList[check];
    req.app.render('detail',{car},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
    });
});

app.get("/delete/:no",function(req,res){
    let no=req.params.no;
    let check=0;
    for(var i=0;i<carList.length;i++){
        if(carList[i].no==no){
            check=i;
        }
    }
    carList.splice(check,1);
    req.app.render('carList',{carList},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
   }); 
});

app.get("/update/:no",function(req,res){
    let no=req.params.no;
    let check=0;
    for(var i=0;i<carList.length;i++){
        if(carList[i].no==no){
            check=i;
        }
    }   
    let car=carList[check];
    req.app.render('update',{car},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
    });
});
app.post("/update_form",function(req,res){
    let no=req.body.no;
    let check=0;
    let name= req.body.name;
    let price= req.body.price;
    let company= req.body.company;
    let year= req.body.year;
    for(var i=0;i<carList.length;i++){
        if(carList[i].no==no){
            check=i;
        }
    }   
    carList[check].name=name;
    carList[check].price=price;
    carList[check].company=company;
    carList[check].year=year;
    let car=carList[check];
    req.app.render('carList',{carList},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
   }); 
   
});
app.get("/add",function(req,res){   
    req.app.render('add',(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
   }); 
});

app.post("/add_form",function(req,res){
    let name= req.body.name;
    let price= req.body.price;
    let company= req.body.company;
    let year= req.body.year;
    carList.push({no:num, name:name, price:price, company:company, year:year});
    num++;
    req.app.render('carList',{carList},(err,html)=>{
        if(err){
            throw err;
        }
        res.end(html);
   }); 
    
});
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('Listening on port: ' + app.get('port'));
});