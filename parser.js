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
    this.moveLines = (move) => {this.line += move;}
    this.moveToColumn = (toColumn) => {this.column = toColumn;}
}

/*
First formate data, separe each crypto, even with data redundance
*/

function CryptoOperation(date, asset, newMediumPrice, remainQuant) {
    this.asset = asset;
    this.date = date;
    this.newMediumPrice = newMediumPrice;
    this.remainQuant = remainQuant;
}

function CryptoReport() {
    this.lastAqDate = 0;
    this.lastAqValue = 0;
    this.lastLOValue = 0;
    this.lastLODate = 0;
}

const parser = new Navigator('O', 2);
const matchCrypto = new RegExp('\d//');
const matchOp = new RegExp('');
//const cryptosList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX"];
const cryptosList = [
    {
        "name": "BTC",
        "operations": []
    },
    {
        "name": "ETH",
        "operations": []
    },
]

// ############################### Operation Parsers #############################
/*
The functions are called by the function parsing, which passes its position in the datasheet to be used as reference
*/
// Operation type 1 - Buying using Real (R$)
function opTypeOne(ref, worksheet) {
    ref.moveToColumn('A');
    const date = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('B');
    const asset = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('I');
    const newMediumPrice = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('N');
    const remainQuant = worksheet.getCell(ref.pos()).value.result;
    
    const newOp = new CryptoOperation(date, asset, newMediumPrice, remainQuant);
    return newOp;
}

workbook.xlsx.readFile('Criptos.xlsx').then(() => {
    console.log("Read file start");
    const worksheet = workbook.worksheets[0];

    function parsing() {
        const cell = worksheet.getCell(parser.pos()).value;
        if (cell) {
            if (cell === 1) {
                //Router to the correct asset
                //Cut name of asset, find its indice in cryptoList and include data in operations
                let op = opTypeOne(parser, worksheet)
                console.log("crypto coin:", op.asset.match(matchCrypto)); //wrong
                cryptosList[0].operations.push(op);
            }
            else if (cell === 2) {

            }
            parser.moveLines(1);
            parsing();
        }
        // End of the datasheet
        else {
            console.log("End of file");
        }
    }
    parsing();

    console.log(cryptosList[0]);
})