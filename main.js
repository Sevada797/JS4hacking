// Function create using ChatGPT
// Status: not tested for now
// I need to test it later) I hope this will help for manual bug hunters, and especially in sites where automation is strongly getting blocked
// My prompt
/*
now make it a function  and collect all iframes src links inside iframe key and other inside a key   like   {'iframe': [....], 'a': []}   
and also add same thing for form  and after action  check with regexp if there is no action="http*"  then  url should be window.location.href+"/"+formActionLink  if non window.location.href doesn't have  / in the end and  
if  formActionLink doesn't have / in it's begining  also with same logic get valid url   considering that action can also be =./endpoint   so here we also have to check if window.location.href is ending with /  thean substring 
fromActionLink 2 else substring 1  so the slash will come and concatenate with window.location.href and we will get valid url  got me??      also with same logic  get all input type=hidden     in inp.hidden   this  all should be  tags  object  
so if I select tags.inp.hidden  I want output like    [{'value':'text1', 'name':'some'}, {'value':'some', 'name':'some'}]   and if u can generate not only for input hidden but for more input types that will help with finding RXSS  
u can put alll these  inn function all  after  calling all()    tags object should be generating  with all described things I told
*/


window.collectTags=function (document) {
    const tags = {
        'a': [],
        'iframe': [],
        'form': []
    };

    // Collect all <a>, <iframe>, and <form> elements
    document.querySelectorAll("a, iframe, form").forEach(element => {
        if (element.tagName === 'A') {
            tags['a'].push(element.href);
        } else if (element.tagName === 'IFRAME') {
            tags['iframe'].push(element.src);
        } else if (element.tagName === 'FORM') {
            const formObj = {
                'action': validateFormAction(element.action),
                'inputs': collectFormInputs(element)
            };
            tags['form'].push(formObj);
        }
    });

    return tags;
}

// Function to validate form action URL
window.validateFormAction=function (action) {
    const regex = /^http(s)?:\/\//;
    if (!regex.test(action)) {
        const baseUrl = window.location.href.endsWith('/') ? window.location.href : window.location.href + '/';
        const formActionLink = action.startsWith('./') ? action.substring(2) : action;
        const validUrl = baseUrl + (formActionLink.startsWith('/') ? formActionLink.substring(1) : formActionLink);
        return validUrl;
    }
    return action;
}

// Function to collect inputs within form
window.collectFormInputs=function (formElement) {
    const inputs = [];
    formElement.querySelectorAll('input').forEach(input => {
        if (input.type === 'hidden') {
            inputs.push({
                'value': input.value,
                'name': input.name
            });
        }
        // Add more conditions here for other input types if needed
    });
    return inputs;
}

// Example usage
//const tags = collectTags(document);
//console.log(tags);

/////////////////////////
//////    NOTE    ///////
/////////////////////////
// Any of these two functions can be used, but there is a small difference between them tho
// When using first one, let's say you do alert() each time, whenever you close the alert then only the timer will continue,
// meanwhile the second script won't care, so if you press alert late intentanoally you will see next alert poping up at light speed,
// so I think in scripts that require user interaction you can use the first one
// but tbh I don't know in what any other situations this could cause trouble or advantage over one another, so I will just keep both
//
/////////////////////////
///  example scripts  ///
/////////////////////////
//  /* This will generate all 4 digit numbers and log them with pause of 0.2 seconds each time */
// easyLoopLimiter( 0, 10000, 200, "let a = (i - ( i % 1000 ) ) / 1000; let b = ( i - ( i % 100 ) ) / 100; let c = ( i - ( i % 10) ) / 10; let d = i % 10; console.log( a.toString() + b.toString() + c.toString() + d.toString() )" )
//
// /* Or you can have your function maybe for making a fetch requests continously or something custom? */ 
// easyLoopLimiter( 0, 1000, 300, 'yourCustomFunction()')
//
// /* You can pass increasing parameter i to your custom function like this */
// easyLoopLimiter( 0, 5, 100, 'custom(i)' );  function custom(n) { alert(n) }
//
//

window.easyLoopLimiter=function (loopStrtNum, loopEndNum, timeToPause, yourFunction) {

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


window.easyLoopLimiter2=function (loopStrtNum, loopEndNum, timeToPause, yourFunction) {

    let i = loopStrtNum;
    let a = setInterval(() => {
        eval(yourFunction);
        i++;
        if (i == loopEndNum) {
            clearInterval(a)
        }
    }, timeToPause)

}
window.showhtml=function () {
// dumb function but I love it, make sure you are in data:, or in safe domain just in case
let a=prompt(); document.body.innerHTML=a;
}
window.links=function () {
// Define a regular expression to match URLs
const urlRegex = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/g;

// Get the text content of the document
const documentText = document.body.innerHTML;

// Use the regular expression to find all URLs in the document
const urls = documentText.match(urlRegex);

// Log the extracted URLs to the console
return urls;

}
window.mails=function () {
// Assuming you want to extract email addresses from a document using JavaScript

// Define a regular expression to match email addresses
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Get the text content of the document
const documentText = document.body.innerHTML;

// Use the regular expression to find all email addresses in the document
const emails = documentText.match(emailRegex);

// Log the extracted email addresses to the console
return emails;

}

window.rmreq=function () {

// Select all elements with the 'required' attribute
const requiredElements = document.querySelectorAll('[required]');

// Iterate through each element and remove the 'required' attribute
requiredElements.forEach(element => {
    element.removeAttribute('required');
});

console.log('All required attributes have been removed.');
}
window.rall=function () {
let a=prompt("Text: "),b=prompt("Replace what?: "),c=prompt("Replace with?: "); document.body.innerText=a.replaceAll(b,c)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  For some rzeason you can't call Shuffler continously, so                                                            /////
////  you might need to reload page import script and than again run Shuffler().                                         /////
////  This could be from eighter chrome blocking multi-download, eighter I have some iteration problem in the script     /////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Examples to run - Shuffler( ['t', 'e', 'x', 't'] )
// also you can run with additional prefix suffix and stringToJoin for ex. Shuffler( [555, '@'], '[', ']', ',')   -  This will make an array format.
// I think this is a useful script for some fuzzing


window.Shuffler=function (array, prefix = '', suffix = '', stringToJoin = '') {
    let fileContent;
    if (array === undefined) {
        return console.error('%cError: First parameter must be defined', 'color: yellow; font-weight: bold;');
    } else if (!Array.isArray(array)) {
        return console.error('%cError: First parameter must be an Array', 'color: yellow; font-weight: bold;');
    }
    fileContent = '';
    let l = array.length;
    let ml = l - 1;
    for (let i = 0; i < factorial(l); i++) {
        let k = i % ml;
        swap(array, ml - k, ml - k - 1);
        fileContent += prefix + array.join(stringToJoin) + suffix + "\n"
    }
    createAndDownloadFile(fileContent)

}


window.swap=function (myArray, x, y) {
    [myArray[x], myArray[y]] = [myArray[y], myArray[x]];
}

window.factorial=function (n) {
    if (n < 0) {
        return "number has to be positive."
    }
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

window.createAndDownloadFile=function (fileContent) {
    alert();
    const blob = new Blob([fileContent], {
        type: 'text/plain'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'example.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a.href = '';
}
window.toki=function (a) {console.log(atob(decodeURIComponent(a).replaceAll('_','/').replaceAll('-','+')))}
window.unhideinp=function () {
document.querySelectorAll('input[type="hidden"]').forEach(input => {
    input.type = 'text';
});
}

console.log("%c[JS4Hacking] Main.js injected 🚀", "color: cyan");
