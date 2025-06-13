function axss() {

let inputs=document.getElementsByTagName("input");
let payload="axss%27%22%3c"; let injection="";
for (i=0;i<inputs.length;i++) {
    injection+="&"+inputs[i].name+"="+payload;
}
injection=injection.replace("&","?");
console.log("Visit & inspect: "+window.location.origin+window.location.pathname+injection);

}