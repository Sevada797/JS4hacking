function unhideinp() {
document.querySelectorAll('input[type="hidden"]').forEach(input => {
    input.type = 'text';
});
}
