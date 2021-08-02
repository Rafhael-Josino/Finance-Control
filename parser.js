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

Sells Report generated:
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
const fs = require('fs');

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

function CryptoOperation(date, asset, local, newMediumPrice, remainQuant) {
    this.asset = asset;
    this.date = date;
    this.local = local;
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
const matchCrypto = new RegExp('\\w+');
const cryptoNamesList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX"];
const cryptosBuyList = [[], [], [], [], [], [], [], []];
const cryptosSellList  = [[], [], [], [], [], [], [], []];

// ############################### Sell Logging #############################
// Is not necessary to be a separated function, it is only generate an object and push in the list
function logSell(asset, aquisitionDate, aquisitionValue, quant, sellingDate, sellingValue, comission, leftOverDate, leftOverValue) {
}

// ############################### Operation Parsers #############################
/*
The functions are called by the function parsing, which passes its position in the datasheet to be used as reference
*/
// Operation type 1 - Buying using Real (R$)
// Reference's line contains the operation in R$
function opTypeOne(ref, worksheet) {
    ref.moveToColumn('A');
    const date = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('B');
    const asset = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('K');
    const local = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('I');
    const newMediumPrice = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('N');
    const remainQuant = worksheet.getCell(ref.pos()).value.result;

    // Returns to the parser column
    ref.moveToColumn('O');
    
    // Moves parser to the operations last line
    ref.moveLines(1);

    const newOp = new CryptoOperation(date, asset, local, newMediumPrice, remainQuant);
    return newOp;
}

// Operation type 2 - Buying using stablecoin
// Reference's line +1 contains sell of stablecoin and +2 buy of crypto
function opTypeTwo(ref, worksheet) {
    // Sell of the sablecoin by the equivalent in R$
    // Values retrieved from worksheet
    ref.moveLines(1);
    ref.moveToColumn('A');
    const sellingDate = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('B');
    let asset = worksheet.getCell(ref.pos()).value.match(matchCrypto)[0];
    ref.moveToColumn('F');
    const sellingValue = worksheet.getCell(ref.pos()).value;

    // Values retrived from data saved

    /*
    Always iterates through the buying list, but could it not start from the last buying?
    Each selling element saves the index of the last buying
    For the first element, this value is 0, that means the first buying element
    */

    // Searches for the first buy operation that still has a remanescent value
    const indexCrypto = cryptoNamesList.findIndex((name) => name === asset);
    let leftOver;
    let debit = sellingValue;
    let aquisitionValue = 0;
    for (let i = 0; i < cryptosBuyList[indexCrypto].length; i++) {
        if (cryptosBuyList[indexCrypto][i].remainQuant) {
            leftOver = cryptosBuyList[indexCrypto][i].remainQuant - debit;
            // If this buy covers the sell (totally or the remanescent)
            if (leftOver >= 0) {
                cryptosBuyList[indexCrypto][i].remainQuant = leftOver; // Updates the quantity remanescent
                const aquisitionDate = cryptosBuyList[indexCrypto][i].date; // Only the last one is used
                aquisitionValue += cryptosBuyList[indexCrypto][i].newMediumPrice * debit; // Medium price * quantity bought + previous buyings
                
                
                break;
            }
            // The buy can not cover the sell and the next(s) one(s) must be checked
            else {
                aquisitionValue += cryptosBuyList[indexCrypto][i].newMediumPrice * cryptosBuyList[indexCrypto][i].remainQuant;
                cryptosBuyList[indexCrypto][i].remainQuant = 0; // Updates the quantity remanescent, which is 0 in this case
                debit = -leftOver;
            } 
        }
    }


    // Buy of the crypto by the equivalent in R$
    ref.moveLines(1);
    ref.moveToColumn('A');
    const date = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('B');
    asset = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('I');
    const newMediumPrice = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('N');
    const remainQuant = worksheet.getCell(ref.pos()).value.result;

    // Returns to the parser column
    ref.moveToColumn('O');
    
    // Moves parser to the operations last line
    ref.moveLines(1);
    
    const newOp = new CryptoOperation(date, asset, newMediumPrice, remainQuant);
    //return newOp;
}

workbook.xlsx.readFile('Criptos.xlsx').then(() => {
    console.log("Read file start");
    const worksheet = workbook.worksheets[0];

    function parsing() {
        const cell = worksheet.getCell(parser.pos()).value;
        console.log(parser.pos(), cell);
        if (cell) {
            if (cell === 1) {
                const op = opTypeOne(parser, worksheet)
                const cryptoName = op.asset.match(matchCrypto)[0]
                console.log("crypto coin:", cryptoName); 
                cryptosBuyList[cryptoNamesList.findIndex((name) => name === cryptoName)].push(op);
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

    console.log(cryptosBuyList);
    const data = JSON.stringify(cryptosBuyList);
    fs.writeFile("operations.json", data, err => {
        if (err) console.log("Write operation failed", err);
        else console.log("Write operation succeeded");
    })
})