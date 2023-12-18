let fileContent;

function Shuffler(array, prefix = '', suffix = '', stringToJoin = '') {
    if (array === undefined) {
        console.error('%cError: First parameter must be defined', 'color: yellow; font-weight: bold;');
    } else if (!Array.isArray(array)) {
        console.error('%cError: First parameter must be an Array', 'color: yellow; font-weight: bold;');
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
