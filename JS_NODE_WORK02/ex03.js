const calc=require('./ex02');

calc.emit('stop', (result) => {
    console.log('result=>',result);
});
calc.emit('pause','안녕하세요');

console.log(calc.title+"에 이벤트 전달 완료!");

