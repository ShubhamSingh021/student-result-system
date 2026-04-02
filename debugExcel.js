const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'student_list.xlsx');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = xlsx.utils.sheet_to_json(sheet);

console.log('--- HEADERS ---');
console.log(Object.keys(rows[0]));
console.log('--- SAMPLE ROW ---');
console.log(rows.find(r => r['Roll No']?.toString().includes('848')) || rows[0]);
