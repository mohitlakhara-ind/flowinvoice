const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..');
const ignoreDirs = ['node_modules', '.next', '.git', 'prisma'];
const ignoreExtensions = ['.png', '.jpg', '.jpeg', '.ico', '.svg', '.jsonl'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    if (ignoreDirs.includes(file)) return;
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      const ext = path.extname(file);
      if (!ignoreExtensions.includes(ext)) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(targetDir);
let changedCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/Soloflow/g, 'Soloflow')
      .replace(/soloflow/g, 'soloflow')
      .replace(/Soloflow/g, 'Soloflow');
      
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated: ' + file);
      changedCount++;
    }
  } catch (err) {
    console.error('Error reading/writing ' + file + ': ' + err.message);
  }
});

console.log(`Updated ${changedCount} files.`);
