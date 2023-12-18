// Any of these funcitons can be used there is a small difference between them tho
//
//
//
///////////////////////
/// example scripts ///
///////////////////////
//  /* This will generate all 4 digit numbers and log them */
// easyLoopLimiter( 0, 10000, 200, "let a = (i - ( i % 1000 ) ) / 1000; let b = ( i - ( i % 100 ) ) / 100; let c = ( i - ( i % 10) ) / 10; let d = i % 10; console.log( a.toString() + b.toString() + c.toString() + d.toString() )" )
// /* Or you can have your custom function maybe for making a fetch requests continously or something custom */ 
// easyLoopLimiter( 0, 1000, 300, 'yourCustomFunction()')

function easyLoopLimiter(loopStrtNum, loopEndNum, timeToPause, yourFunction) {

    function loop(i) {
        if (i < loopEndNum) {
            eval(yourFunction);
            setTimeout(() => {
                i++;
                loop(i)
            }, timeToPause);
        } else {
            return;
        }
    }

    setTimeout(() => {
        loop(loopStrtNum)
    }, timeToPause);


}


function easyLoopLimiter2(loopStrtNum, loopEndNum, timeToPause, yourFunction) {

    let i = loopStrtNum;
    let a = setInterval(() => {
        eval(yourFunction);
        i++;
        if (i == loopEndNum) {
            clearInterval(a)
        }
    }, timeToPause)

}
