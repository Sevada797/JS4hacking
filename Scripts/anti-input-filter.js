const inputs = document.querySelectorAll("input");

// Convert NodeList to array and iterate over each input element
Array.from(inputs).forEach((input) => {
    // Check if not button
    if (input.type!="submit") {
    // Remove the 'required' attribute
    input.removeAttribute("required");

    // Set the 'type' attribute to 'text'
    input.setAttribute("type", "text");
}});
