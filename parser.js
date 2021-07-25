const ExcelJS = require('exceljs');

let workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile('Criptos.xlsx').then(() => {
    console.log("Read file start");
    const worksheet = workbook.worksheets[0];

    console.log(worksheet.getCell('A3').value);    
})

console.log("Teste end");