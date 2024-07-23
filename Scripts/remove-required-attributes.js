// Select all elements with the 'required' attribute
const requiredElements = document.querySelectorAll('[required]');

// Iterate through each element and remove the 'required' attribute
requiredElements.forEach(element => {
    element.removeAttribute('required');
});

console.log('All required attributes have been removed.');
