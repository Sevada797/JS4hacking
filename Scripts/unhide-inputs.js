window.unhideinp=function () {
document.querySelectorAll('input[type="hidden"]').forEach(input => {
    input.type = 'text';
});
}
