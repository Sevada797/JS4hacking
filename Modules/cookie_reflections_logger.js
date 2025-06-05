    document.cookie
      .split('; ')
      .forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (value && value.length > 5 && document.body.outerHTML.includes(value)) {
          console.log(
            `%c[!] Found reflected cookie: ${name}=${value}`,
            'color: yellow; font-weight: bold;'
          );
        }
      });