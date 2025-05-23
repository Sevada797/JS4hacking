function menu() {
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const magenta = "\x1b[35m";
    const green = "\x1b[32m";
  
    console.log(`
  ${bold}${cyan}=== Useful Functions Menu ===${reset}
  
  ${yellow}1) corscheck()${reset}
     ${magenta}- Mass fetch in CORS mode across [sub]domains
     - Check for accessible targets (useful for POST XSS CSRF)
  
  ${yellow}2) easyLoopLimiter()${reset}
     ${magenta}- Helps prevent CPU burnouts in heavy loops
  
  ${yellow}3) links()${reset}
     ${magenta}- Collects links from current page
     - Logs as array
  
  ${yellow}4) mails()${reset}
     ${magenta}- Extracts emails from current page
     - Logs as array
  
  ${yellow}5) toki()${reset}
     ${magenta}- Decodes Base64 tokens
     - Auto URL-decodes and replaces safe chars
  
  ${yellow}6) brute()${reset}
     ${magenta}- Auto-detects login inputs (user/pass)
     - Launches bruteforce attempt (for legal testing only)
  `);
  }
  