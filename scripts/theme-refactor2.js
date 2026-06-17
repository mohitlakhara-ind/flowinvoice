const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '../app/dashboard'),
  path.join(__dirname, '../components/dashboard')
];

const replacements = [
  { regex: /placeholder-slate-500/g, replacement: 'placeholder-[var(--text-3)]' },
  { regex: /placeholder-slate-400/g, replacement: 'placeholder-[var(--text-3)]' },
  { regex: /focus:border-purple-500/g, replacement: 'focus:border-[var(--primary)]' },
  { regex: /focus:border-indigo-500/g, replacement: 'focus:border-[var(--primary)]' },
  { regex: /focus:ring-indigo-500/g, replacement: 'focus:ring-[var(--primary)]' },
  { regex: /focus:ring-purple-500/g, replacement: 'focus:ring-[var(--primary)]' },
  { regex: /text-purple-500/g, replacement: 'text-[var(--primary)]' },
  { regex: /bg-purple-500/g, replacement: 'bg-[var(--primary)]' },
  { regex: /border-purple-500/g, replacement: 'border-[var(--primary)]' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}
