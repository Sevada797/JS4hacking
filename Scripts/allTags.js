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


function collectTags(document) {
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
function validateFormAction(action) {
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
function collectFormInputs(formElement) {
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

