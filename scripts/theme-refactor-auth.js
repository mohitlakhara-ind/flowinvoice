const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '../app/login'),
  path.join(__dirname, '../app/register')
];

const replacements = [
  // Backgrounds
  { regex: /bg-\[#1a1a24\]/g, replacement: 'bg-[var(--surface-2)]' },
  { regex: /bg-\[#0a0a0f\]/g, replacement: 'bg-[var(--bg)]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[var(--bg)]' },
  { regex: /bg-slate-950/g, replacement: 'bg-[var(--bg)]' },
  { regex: /bg-slate-800/g, replacement: 'bg-[var(--surface)]' },
  { regex: /bg-slate-800\/50/g, replacement: 'bg-[var(--surface)]\/50' },
  { regex: /bg-white\/5/g, replacement: 'bg-[var(--surface-2)]' },
  { regex: /bg-white/g, replacement: 'bg-[var(--surface)]' },
  { regex: /bg-slate-50/g, replacement: 'bg-[var(--bg)]' },
  { regex: /bg-slate-100/g, replacement: 'bg-[var(--surface-2)]' },
  { regex: /hover:bg-slate-800/g, replacement: 'hover:bg-[var(--surface-2)]' },
  { regex: /hover:bg-[#2a2a3a]/g, replacement: 'hover:bg-[var(--border)]' },
  { regex: /hover:bg-slate-50/g, replacement: 'hover:bg-[var(--surface-2)]' },
  { regex: /hover:bg-slate-100/g, replacement: 'hover:bg-[var(--surface-2)]' },

  // Borders
  { regex: /border-\[#2a2a3a\]/g, replacement: 'border-[var(--border)]' },
  { regex: /border-slate-800/g, replacement: 'border-[var(--border)]' },
  { regex: /border-slate-700/g, replacement: 'border-[var(--border)]' },
  { regex: /border-slate-200/g, replacement: 'border-[var(--border)]' },
  { regex: /border-slate-100/g, replacement: 'border-[var(--border)]' },
  { regex: /hover:border-\[#3a3a50\]/g, replacement: 'hover:border-[var(--border-hov)]' },
  { regex: /hover:border-slate-700/g, replacement: 'hover:border-[var(--border-hov)]' },
  { regex: /hover:border-slate-600/g, replacement: 'hover:border-[var(--border-hov)]' },
  { regex: /hover:border-slate-300/g, replacement: 'hover:border-[var(--border-hov)]' },

  // Texts
  { regex: /text-slate-900/g, replacement: 'text-[var(--text-1)]' },
  { regex: /text-slate-800/g, replacement: 'text-[var(--text-1)]' },
  { regex: /text-slate-700/g, replacement: 'text-[var(--text-2)]' },
  { regex: /text-slate-600/g, replacement: 'text-[var(--text-2)]' },
  { regex: /text-slate-500/g, replacement: 'text-[var(--text-3)]' },
  { regex: /text-slate-400/g, replacement: 'text-[var(--text-2)]' },
  { regex: /text-slate-300/g, replacement: 'text-[var(--text-1)]' },
  { regex: /text-white/g, replacement: 'text-[var(--text-1)]' },

  // Placeholders
  { regex: /placeholder-slate-500/g, replacement: 'placeholder-[var(--text-3)]' },
  { regex: /placeholder-slate-400/g, replacement: 'placeholder-[var(--text-3)]' },

  // Primaries (Indigo -> Primary)
  { regex: /bg-indigo-600\/15/g, replacement: 'bg-[var(--primary)]\/15' },
  { regex: /bg-indigo-600/g, replacement: 'bg-[var(--primary)]' },
  { regex: /bg-indigo-500/g, replacement: 'bg-[var(--primary)]' },
  { regex: /bg-indigo-500\/10/g, replacement: 'bg-[var(--primary)]\/10' },
  { regex: /bg-indigo-500\/15/g, replacement: 'bg-[var(--primary)]\/15' },
  { regex: /bg-indigo-500\/20/g, replacement: 'bg-[var(--primary)]\/20' },
  { regex: /text-indigo-600/g, replacement: 'text-[var(--primary)]' },
  { regex: /text-indigo-500/g, replacement: 'text-[var(--primary)]' },
  { regex: /text-indigo-400/g, replacement: 'text-[var(--primary)]' },
  { regex: /text-indigo-300/g, replacement: 'text-[var(--primary)]' },
  { regex: /border-indigo-600/g, replacement: 'border-[var(--primary)]' },
  { regex: /border-indigo-500/g, replacement: 'border-[var(--primary)]' },
  { regex: /border-indigo-500\/20/g, replacement: 'border-[var(--primary)]\/20' },
  { regex: /border-indigo-500\/50/g, replacement: 'border-[var(--primary)]\/50' },
  { regex: /hover:bg-indigo-700/g, replacement: 'hover:bg-[var(--primary-hov)]' },
  { regex: /hover:bg-indigo-500/g, replacement: 'hover:bg-[var(--primary-hov)]' },
  { regex: /hover:text-indigo-700/g, replacement: 'hover:text-[var(--primary-hov)]' },
  { regex: /hover:text-indigo-300/g, replacement: 'hover:text-[var(--primary-hov)]' },
  
  // Focus Rings
  { regex: /focus:border-purple-500/g, replacement: 'focus:border-[var(--primary)]' },
  { regex: /focus:border-indigo-500/g, replacement: 'focus:border-[var(--primary)]' },
  { regex: /focus:ring-indigo-500/g, replacement: 'focus:ring-[var(--primary)]' },
  { regex: /focus:ring-purple-500/g, replacement: 'focus:ring-[var(--primary)]' },
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
