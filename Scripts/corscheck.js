async function corscheck(num=0) {
    const input = prompt("Enter domains (newline separated):");
    if (!input) return;
  
    const domains = input.split('\n').map(d => d.trim()).filter(Boolean);
    const successful = [];
  
    for (const domain of domains) {
      const url = `https://${domain}/`;
  
      try {
        const res = num==0 ? await fetch(url, { mode: 'cors' }) : await fetch(url, { mode: 'cors', credentials:'include' }) ;
        console.log(`✅ Fetched: ${url}`);
        successful.push(domain);
      } catch (e) {
        console.log(`❌ Failed: ${url}`);
      }
    }
  
    console.log(`\n🎯 Accessible subs:\n`, successful.join('\n'));
  }