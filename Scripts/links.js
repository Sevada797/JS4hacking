function links() {
// Define a regular expression to match URLs
const urlRegex = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/g;

// Get the text content of the document
const documentText = document.body.innerHTML;

// Use the regular expression to find all URLs in the document
const urls = documentText.match(urlRegex);

// Log the extracted URLs to the console
return urls;

}
