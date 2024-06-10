 const bypassed = [];
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
// easyLoopLimiter function
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

    function loadUrl(i) {
        if (i < urls.length) {
            iframe.src = urls[i];
             try { if (typeof(iframe.contentWindow) =='object' ) {

              
                bypassed.push(urls[i]);
                console.log(`URL bypassed: ${urls[i]}`);
             }
                 } catch{}

        }
    }


// Get input list and split by newline
const inputList = `https://example.com
https://facebook.com/
https://chatgpt.com/backend-api/me
`;

// Convert input list to an array of URLs
const urls = inputList.split('\n');
    // Start the loop using easyLoopLimiter
    easyLoopLimiter(0, urls.length, 2000, 'loadUrl(i)');

