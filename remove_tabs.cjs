const fs = require('fs');
const file = 'src/components/SettingsView.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIndex = content.indexOf(') : activeSubTab === \'custom-fields\' ? (');
const endIndex = content.indexOf(') : (\r\n                    <div className="p-20 text-center">');

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log('Successfully removed custom-fields to integrations blocks.');
} else {
    const fallbackIndex = content.indexOf(') : (\n                    <div className="p-20 text-center">');
    if(fallbackIndex !== -1 && startIndex !== -1) {
        content = content.substring(0, startIndex) + content.substring(fallbackIndex);
        fs.writeFileSync(file, content);
        console.log('Successfully removed using \\n');
    } else {
        console.log('Could not find start or end strings.');
        console.log('Start index:', startIndex);
        console.log('End index \\r\\n:', endIndex);
        console.log('End index \\n:', fallbackIndex);
    }
}
