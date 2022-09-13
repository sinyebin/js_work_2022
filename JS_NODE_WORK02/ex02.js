var util=requir('util');
var EventEmitter = require('events').EventEmitter;

class Calc extends EventEmitter{
    constructor(){
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
calc.on('stop',()=>{
    console.log('stop calc');   
});

module.exports = calc;
module.exports.title='Calculator';