// Assuming you want to extract email addresses from a document using JavaScript

// Define a regular expression to match email addresses
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Get the text content of the document
const documentText = document.body.innerText;

// Use the regular expression to find all email addresses in the document
const emails = documentText.match(emailRegex);

// Log the extracted email addresses to the console
console.log(emails);
