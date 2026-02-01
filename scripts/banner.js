console.clear();

// ANSI styles
const violet = '\x1b[35m';
const orange = '\x1b[38;5;208m';
const italic = '\x1b[3m';
const reset = '\x1b[0m';
const dim = '\x1b[2m';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- BANNER ----
console.log(`
${italic}${violet}
 ██████╗ ██████╗ ███╗   ███╗██████╗ ███████╗████████╗███████╗███╗   ██╗ ██████╗██╗   ██╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝████╗  ██║██╔════╝╚██╗ ██╔╝
██║     ██║   ██║██╔████╔██║██████╔╝█████╗     ██║   █████╗  ██╔██╗ ██║██║      ╚████╔╝ 
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██╔══╝     ██║   ██╔══╝  ██║╚██╗██║██║       ╚██╔╝  
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗   ██║   ███████╗██║ ╚████║╚██████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝ ╚═════╝   ╚═╝   

${italic}${orange}
 ██████╗██╗     ██╗   ██╗███████╗████████╗███████╗██████╗ 
██╔════╝██║     ██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██║     ██║     ██║   ██║███████╗   ██║   █████╗  ██████╔╝
██║     ██║     ██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗
╚██████╗███████╗╚██████╔╝███████║   ██║   ███████╗██║  ██║
 ╚═════╝╚══════╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
${reset}
`);

(async () => {
  const total = 30;
  process.stdout.write(`${dim}Booting dev environment...\n${reset}`);

  for (let i = 0; i <= total; i++) {
    const percent = Math.round((i / total) * 100);
    const bar =
      `${orange}` +
      '█'.repeat(i) +
      `${dim}` +
      '░'.repeat(total - i) +
      `${reset}`;

    process.stdout.write(`\r${bar} ${percent}%`);
    await sleep(5000 / total);
  }

  process.stdout.write(`\n\n${violet}✔ Environment ready. Starting services...\n${reset}\n`);
})();
