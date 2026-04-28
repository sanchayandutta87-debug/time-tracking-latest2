const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'components');

const replacements = [
  { regex: /\bbg-white\b(?! dark:)/g, replacement: 'bg-white dark:bg-[#15152b]' },
  { regex: /\bbg-gray-50\b(?! dark:)/g, replacement: 'bg-gray-50 dark:bg-[#0a0a1a]' },
  { regex: /\bbg-slate-50\b(?! dark:)/g, replacement: 'bg-slate-50 dark:bg-[#0a0a1a]' },
  { regex: /\bborder-gray-100\b(?! dark:)/g, replacement: 'border-gray-100 dark:border-gray-800' },
  { regex: /\bborder-gray-200\b(?! dark:)/g, replacement: 'border-gray-200 dark:border-gray-700' },
  { regex: /\btext-gray-800\b(?! dark:)/g, replacement: 'text-gray-800 dark:text-white' },
  { regex: /\btext-gray-900\b(?! dark:)/g, replacement: 'text-gray-900 dark:text-white' },
  { regex: /\btext-gray-700\b(?! dark:)/g, replacement: 'text-gray-700 dark:text-gray-200' },
  { regex: /\btext-gray-600\b(?! dark:)/g, replacement: 'text-gray-600 dark:text-gray-300' },
  { regex: /\btext-gray-500\b(?! dark:)/g, replacement: 'text-gray-500 dark:text-gray-400' },
  { regex: /\bbg-blue-50\b(?! dark:)/g, replacement: 'bg-blue-50 dark:bg-blue-900\/20' },
  { regex: /\bbg-indigo-50\b(?! dark:)/g, replacement: 'bg-indigo-50 dark:bg-indigo-900\/20' },
  { regex: /\bbg-emerald-50\b(?! dark:)/g, replacement: 'bg-emerald-50 dark:bg-emerald-900\/20' },
  { regex: /\bbg-red-50\b(?! dark:)/g, replacement: 'bg-red-50 dark:bg-red-900\/20' },
  { regex: /\bbg-amber-50\b(?! dark:)/g, replacement: 'bg-amber-50 dark:bg-amber-900\/20' },
];

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Done!');
