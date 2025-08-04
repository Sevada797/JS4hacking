function afill(k, mail) {
  const text = k || "Lorem ipsum dolor sit amet";
  const email = mail || "lorem@ipsum.com";
  const number = "12345";
  const pass = "Pass_12345!";
  const date = "2025-07-02";

  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.disabled || el.readOnly) return;

    switch (el.type) {
      case "email":
        el.value = email;
        break;
      case "text":
      case "search":
      case "":
        el.value = text;
        break;
      case "password":
        el.value = pass;
        break;
      case "number":
      case "tel":
        el.value = number;
        break;
      case "date":
        el.value = date;
        break;
      case "url":
        el.value = "https://example.com";
        break;
      case "checkbox":
      case "radio":
        el.checked = true;
        break;
      default:
        if (el.tagName === "TEXTAREA") {
          el.value = text + " - textarea";
        } else if (el.tagName === "SELECT") {
          el.selectedIndex = 1;
        }
    }
  });

  console.log(`✅ Autofilled with text: "${text}", email: "${email}", and password: "${pass}"`);
}
