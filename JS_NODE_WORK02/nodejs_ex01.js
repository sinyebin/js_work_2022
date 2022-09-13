const path = require('path');

console.log("os의 path 구분자 ----> %s", path.sep);

// 디렉토리 이름을 array에 넣어서 합치기
const directories = ['users','newDir','newDocs'];
const docsDirectory = directories.join(path.sep);
console.log("합체된 문자 디렉토리 path = %s", docsDirectory);

// 디렉토리와 파일명 합치기
var curPath=path.join('/Users/newDir','app.exe');
console.log("새 파일 패스: %s", curPath);

console.log("현재 실행 파일의 디렉토리 위치: %s",__dirname);
console.log("현재 실행 파일의 파일의 위치: %s",__filename);

// 패스에서 디렉토리, 파일명, 확장자 구별하기
var filename= __filename;
var dirname = path.dirname(filename);
var basename=path.basename(filename);
var extname=path.extname(filename);
console.log(dirname, " ",basename," ",extname);