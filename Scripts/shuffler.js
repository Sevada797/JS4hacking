//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  For some reason you can't call Shuffler continously, so                                                            /////
////  you might need to reload page import script and than again run Shuffler().                                         /////
////  This could be from eighter chrome blocking multi-download, eighter I have some iteration problem in the script     /////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Examples to run - Shuffler( ['t', 'e', 'x', 't'] )
// also you can run with additional prefix suffix and stringToJoin for ex. Shuffler( [555, '@'], '[', ']', ',')   -  This will make an array format.
// I think this is a useful script for some fuzzing


let fileContent;

function Shuffler(array, prefix = '', suffix = '', stringToJoin = '') {
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
    createAndDownloadFile()

}


function swap(myArray, x, y) {
    [myArray[x], myArray[y]] = [myArray[y], myArray[x]];
}

function factorial(n) {
    if (n < 0) {
        return "number has to be positive."
    }
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function createAndDownloadFile() {
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
