/*
Sheet's columns escription:
A - Date
B - Pair: Asset / Coin evaluated
C - Operation
D - Medium price
E - Total bought
F - Total sold OR Tax (if buy operation)
G - Value paid
H - Value received
I - New asset's medium price
J - Profit
K - Operation's local
L - Observations
...
O - navigator

Types of operation:
1 - Buying using Real (R$)
2 - Buying using stablecoin 
3 - Selling by stablecoin
4 - Permute of criptocurrency by another

Report generated:
- JSON file per criptocurrency:
{
    nº selling: {
        aquisitionDate: "aDate",
        aquisitionValue: aValue,
        quant: quantValue,
        sellingDate: "sDate",
        sellingValue: sValue,
        comission: cValue,
        leftOverValue: loValue,
        leftOverDate: loDate
    }
}
*/

const ExcelJS = require('exceljs');

let workbook = new ExcelJS.Workbook();

// Object that represents a cell of the datasheet
function Navigator(column, line) {
    this.column = column;
    this.line = line;
    this.pos = () => {return this.column + this.line}
    this.parseColumn = () => {

    }
    this.parseLine = () => this.line++
}

/*
First formate data, separe each crypto, even with data redundance
*/

function CryptoOp(date, mediumPrice, remainQuant) {
    this.date = date;
    this.mediumPrice = mediumPrice;
    this.remainQuant = remainQuant;
}

function CryptoReport() {
    this.lastAqDate = 0;
    this.lastAqValue = 0;
    this.lastLOValue = 0;
    this.lastLODate = 0;
}

const parser = new Navigator('O', 2);
const cryptosList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX"];
const matchCrypto = new RegExp('');
const matchOp = new RegExp('');
const operationsList = [];

// ############################### Operation Parsers #############################
/*
The functions are called by the parser, which passes its position in the datasheet to be used as reference
*/
// Operation type 1 - Buying using Real (R$)
function opTypeOne(reference) {

}

workbook.xlsx.readFile('Criptos.xlsx').then(() => {
    console.log("Read file start");
    const worksheet = workbook.worksheets[0];

    function parsing() {
        const cell = worksheet.getCell(parser.pos()).value;
        if (cell) {
            console.log(parser.pos(), ":", cell);
            parser.parseLine();
            parsing();
        }
        else {
            console.log("End of file");
        }
    }

    parsing();

})