function links() {
    const urlRegex = /https?:\/\/[^\s"'\<\>]+/g; // simpler & safer
    const documentText = document.body.innerHTML;
    const urls = documentText.match(urlRegex);
    return urls;
}
