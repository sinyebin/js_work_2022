var fs=require('fs');
var msg = 'Hello World!';
fs.writeFile('./output.txt',msg,function(err){
    if(err){
        console.log("Error:"+err);
    }
    console.log("ouput.txt 파일에 데이터 쓰기 완료!");
});