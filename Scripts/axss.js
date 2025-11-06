function axss() {
    let inputs = document.getElementsByTagName("input");
    let payload = "axss%27%22%3c";
    let params = [];
    
    for (let i = 0; i < inputs.length; i++) {
        // Check if name attribute exists and is not empty
        if (inputs[i].name && inputs[i].name.trim() !== "") {
            params.push(inputs[i].name + "=" + payload);
        }
    }
    
    if (params.length > 0) {
        let injection = "?" + params.join("&");
        let testUrl = window.location.origin + window.location.pathname + injection;
        console.log("Visit & inspect: " + testUrl);
    } else {
        console.log("Nothing here, look somewhere else with inputs/forms");
    }
}
