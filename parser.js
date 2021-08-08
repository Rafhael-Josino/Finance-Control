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
        quantSold: quantValue,
        sellingDate: "sDate",
        sellingValue: sValue,
        comission: cValue,
        indexesOfBuyings: indexes,
        leftOverQuant: loQuant,
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

// Change name
function CryptoOperation(date, asset, local, newMediumPrice, remainQuant) {
    this.asset = asset;
    this.date = date;
    this.local = local;
    this.newMediumPrice = newMediumPrice;
    this.remainQuant = remainQuant;
}

function CryptoSell(sellingDate, asset, sellingValue, aquisitionDate, aquisitionValue, quantSold, buyIndexes, leftOverQuant) {
    this.sellingDate = sellingDate;
    this.asset = asset;
    this.sellingValue = sellingValue;
    this.aquisitionDate = aquisitionDate;
    this.aquisitionValue = aquisitionValue;
    this.quantSold = quantSold;
    this.buyIndexes = buyIndexes;
    this.leftOverQuant = leftOverQuant;
}

// The parser, as a global instance of an object, may have not necessity of being called in functions
// Test this with function opTypeOne
const parser = new Navigator('O', 2);
const matchCrypto = new RegExp('\\w+');
const cryptoNamesList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX"];
const cryptosBuyList = [[], [], [], [], [], [], [], []];
const cryptosSellList  = [[], [], [], [], [], [], [], []];

// ############################### Log Functions #############################
// Check if the whole process of create a CryptoSell object, present so far in the function opTypeTwo, can be separeted in another function
// and then called in the operationTypes functions
// By this line of thought, could be a Buy logging function, if each buying is in essence, the same process, and the operations functions
// just parser each operation and call the pertinent logging function at each datasheet line
// The logging functions return then the a CryptoSell or CryptoBuy object.
//function logSell(asset, aquisitionDate, aquisitionValue, quant, sellingDate, sellingValue, comission, leftOverDate, leftOverValue) {}
function logBuy(worksheet, typeOp) {
    parser.moveToColumn('A');
    const date = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('B');
    const asset = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('K');
    const local = worksheet.getCell(parser.pos()).value;
    // There are operations where the medium price is calculated
    parser.moveToColumn('I');
    let newMediumPrice;
    if (typeOp < 3) newMediumPrice = worksheet.getCell(parser.pos()).value;
    else newMediumPrice = worksheet.getCell(parser.pos()).value.result; // Yet to test
    parser.moveToColumn('N');
    const remainQuant = worksheet.getCell(parser.pos()).value.result;

    // Returns to the parser column
    parser.moveToColumn('O');
    
    const newOp = new CryptoOperation(date, asset, local, newMediumPrice, remainQuant);
    return newOp;
}

function logSell() {

}


// ############################### Operation Parsers #############################
/*
The functions are called by the function parsing, which passes its position in the datasheet to be used as reference
*/
// Operation type 1 - Buying using Real (R$)
// Reference's line contains the operation in R$
function opTypeOne(worksheet) {
    /*
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
    */
    const newBuy = logBuy(worksheet, 1);
    // Moves parser to the operations last line
    parser.moveLines(1);
    return newBuy;
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
    const sellingQuant = worksheet.getCell(ref.pos()).value;
    ref.moveToColumn('H');
    const sellingValue= worksheet.getCell(ref.pos()).value;

    // Values retrived from data saved

    /*
    Always iterates through the buying list, but could it not start from the last buying?
    All the elements would check if the previous sell has leftOvers
    It it is the case, the loop would start from this buy, whose index is stored in the previous sell
    */

    // Searches for the first buy operation that still has a remanescent value
    const indexCrypto = cryptoNamesList.findIndex((name) => name === asset);
    let leftOver;
    let debit = sellingQuant;
    let aquisitionValue = 0;
    let buyIndexes = [];
    // Insert check code to define "i", depending on previous sells with leftOvers
    for (let i = 0; i < cryptosBuyList[indexCrypto].length; i++) {
        if (cryptosBuyList[indexCrypto][i].remainQuant) {
            leftOver = cryptosBuyList[indexCrypto][i].remainQuant - debit;
            // If this buying covers the sell (totally or the remanescent)
            if (leftOver >= 0) {
                cryptosBuyList[indexCrypto][i].remainQuant = leftOver; // Updates the quantity remanescent
                const aquisitionDate = cryptosBuyList[indexCrypto][i].date; // Only the last one is used
                aquisitionValue += cryptosBuyList[indexCrypto][i].newMediumPrice * debit; // Medium price * quantity bought + previous buyings
                buyIndexes.push(i);
                break;
            }
            // If the buying cannot cover the sell and the next(s) one(s) must be checked
            else {
                aquisitionValue += cryptosBuyList[indexCrypto][i].newMediumPrice * cryptosBuyList[indexCrypto][i].remainQuant;
                cryptosBuyList[indexCrypto][i].remainQuant = 0; // Updates the quantity remanescent, which is 0 in this case
                debit = -leftOver; // Updates the debit
                buyIndexes.push(i);
            }
            // In both cases, pehaps the buying objects should not have the values of their attributes changed (changes the log)
        }
    }
    const newSell = new CryptoSell(sellingDate, asset, sellingValue, aquisitionDate, aquisitionValue, sellingQuant, buyIndexes, leftOver);

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
    
    const newBuy = new CryptoOperation(date, asset, newMediumPrice, remainQuant);
    
    return [newSell, newBuy];
}

workbook.xlsx.readFile('Criptos.xlsx').then(() => {
    console.log("Read file start");
    const worksheet = workbook.worksheets[0];

    function parsing() {
        const cell = worksheet.getCell(parser.pos()).value;
        console.log(parser.pos(), cell);
        if (cell) {
            if (cell === 1) {
                const op = opTypeOne(worksheet)
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