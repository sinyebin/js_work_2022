var util=require('util');
var EventEmitter = require('events').EventEmitter;

class Calc extends EventEmitter{
    constructor(){
        super();
        this.result=0;
        this.on('pause',function(){
            console.log('pause Calc ...')
        })
    }
    add(x,y){
        this.result=x+y;
        return this.result;
    }
};
var calc=new Calc();
calc.on('stop',(callback)=>{
    console.log('stop calc');   
    callback(365);
});

module.exports = calc;
module.exports.title='Calculator';