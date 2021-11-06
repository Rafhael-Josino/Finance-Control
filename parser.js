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
3 - Selling by Real (R$)
4 - Selling by stablecoin
5 - Permute of criptocurrency by another

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
function CryptoOperation(date, asset, local, totalBought, purchaseMediumPrice, tax, newMediumPrice) {
    this.asset = asset;
    this.date = date;
    this.local = local;
    this.totalBought = totalBought;
    this.purchaseMediumPrice = purchaseMediumPrice;
    this.tax = tax;
    this.remainQuant = totalBought - tax;
    this.newMediumPrice = newMediumPrice;
}

function CryptoSell(sellingDate, asset, local, received, aquisitionDate, aquisitionValue, quantSold, buyIndexes, leftOverQuant) {
    // Attributes that are present in the sheet:
    this.sellingDate = sellingDate;
    this.asset = asset;
    this.local = local;
    this.received = received;
    this.quantSold = quantSold;

    // Attributes that are obtained from previous purchases:
    this.aquisitionDate = aquisitionDate;
    this.aquisitionValue = aquisitionValue;
    this.buyIndexes = buyIndexes;
    this.leftOverQuant = leftOverQuant;
}

function CryptoSoldLog(index, quant, price) {
    this.index = index;
    this.quant = quant;
    this.price = price;
}

// The parser, as a global instance of an object, may have not necessity of being called in functions
// Test this with function opTypeOne
const parser = new Navigator('O', 2);
const matchCrypto = new RegExp('\\w+');
const cryptoNamesList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX"];
const cryptosBuyList = [[], [], [], [], [], [], [], []];
const cryptosSellList  = [[], [], [], [], [], [], [], []];

// ############################### Log Functions #############################
// Each log function is called when the parser is already in its line from the sheet

// Check if the whole process of create a CryptoSell object, present so far in the function opTypeTwo, can be separeted in another function
// and then called in the operationTypes functions
// By this line of thought, could be a Buy logging function, if each buying is in essence, the same process, and the operations functions
// just parser each operation and call the pertinent logging function at each datasheet line
// The logging functions return then the a CryptoSell or CryptoBuy object.

function logBuy(worksheet, typeOp) {
    parser.moveToColumn('A');
    const date = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('B');
    const asset = worksheet.getCell(parser.pos()).value.match(matchCrypto)[0];
    parser.moveToColumn('D');
    const purchaseMediumPrice = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('K');
    const local = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('E');
    const totalBought = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('F');
    const tax = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('I');
    let newMediumPrice;
    newMediumPrice = worksheet.getCell(parser.pos()).value.result; // Yet to test
    // If the cell has not a calculated value
    if (!newMediumPrice) newMediumPrice = worksheet.getCell(parser.pos()).value;

    // Returns to the parser column and go to next line
    parser.moveToColumn('O');
    parser.moveLines(1);
    
    const newOp = new CryptoOperation(date, asset, local, totalBought, purchaseMediumPrice, tax, newMediumPrice);
    return newOp;
}

function logSell(worksheet, typeOp) {
    parser.moveToColumn('A');
    const sellingDate = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('B');
    const asset = worksheet.getCell(parser.pos()).value.match(matchCrypto)[0];
    parser.moveToColumn('K');
    const local = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('F');
    const sellingQuant = worksheet.getCell(parser.pos()).value;
    parser.moveToColumn('H');
    let received;
    // For now, only operation type 3 and 4 has a received value calculated
    if (typeOp > 2) received = worksheet.getCell(parser.pos()).value.result;
    else received = worksheet.getCell(parser.pos()).value;

    /*
    Always iterates through the buying list, but could it not start from the last purchase?
    All the elements would check if the previous sell has leftOvers
    If it is the case, the loop would start from this buy, whose index is stored in the previous sell

    Separate by operation's local
    */

    const indexCrypto = cryptoNamesList.findIndex((name) => name === asset);
    let leftOver; // in cryptos
    let debit = sellingQuant; // in cryptos
    let aquisitionValue = 0; // in FIAT coin
    let aquisitionDate;
    let buyIndexes = [];
    // Searches for the first purchase operation that still has a remanescent value
    // Insert check code to define "i", depending on previous sells with leftOvers
    for (let i = 0; i < cryptosBuyList[indexCrypto].length; i++) {
        if (cryptosBuyList[indexCrypto][i].remainQuant) {
            leftOver = cryptosBuyList[indexCrypto][i].remainQuant - debit;
            // If the quantity of this purchase covers the sell (totally or the with a rest)
            if (leftOver >= 0) {
                cryptosBuyList[indexCrypto][i].remainQuant = leftOver; // Updates the quantity remanescent
                // Aquisition value = this purchase medium price * quantity bought + previous purchase's values
                aquisitionValue += cryptosBuyList[indexCrypto][i].purchaseMediumPrice * debit; 
                buyIndexes.push(new CryptoSoldLog(
                    cryptosBuyList[indexCrypto][i].date, 
                    debit, 
                    cryptosBuyList[indexCrypto][i].purchaseMediumPrice)
                );
                break;
            }
            // If the buying cannot cover the sell and the next(s) one(s) must be checked
            else {
                aquisitionValue += cryptosBuyList[indexCrypto][i].purchaseMediumPrice * cryptosBuyList[indexCrypto][i].remainQuant;
                buyIndexes.push(new CryptoSoldLog(
                    cryptosBuyList[indexCrypto][i].date, 
                    cryptosBuyList[indexCrypto][i].remainQuant, 
                    cryptosBuyList[indexCrypto][i].purchaseMediumPrice)
                );
                cryptosBuyList[indexCrypto][i].remainQuant = 0; // Updates the quantity remanescent, which is 0 in this case
                debit = -leftOver; // Updates the debit
            }
        }
    }

    // Returns to the parser column (O) and go to the next line
    parser.moveToColumn('O');
    parser.moveLines(1);

    const newSell = new CryptoSell(sellingDate, asset, local, received, "see buyIndexes", aquisitionValue, sellingQuant, buyIndexes, leftOver);
    return newSell;
}


// ##################################################### Operation Parsers ################################################
/*
The functions are called by the function parsing, which passes its position in the datasheet to be used as reference
*/
// Operation type 1 - Buying using Real (R$)
// Line +0 : purchase in R$
function opTypeOne(worksheet) {
    const newBuy = logBuy(worksheet, 1);
    return newBuy;
}

// Operation type 2 - Buying using stablecoin
// Line +1 : equivalent in R$ of the stablecoin's sell
// Line +2 : purchase of crypto, using the equivalent in R$ from the stablecoin's sell
function opTypeTwo(worksheet) {
    // Sell of the sablecoin by the equivalent in R$
    parser.moveLines(1);
    const newSell = logSell(worksheet, 2);
    const newBuy = logBuy(worksheet, 2);
    return [newSell, newBuy];
}

// Operation type 3 - Selling using Real (R$)
// Line +1 : sell in R$
function opTypeThree(worksheet) {
    const newSell = logSell(worksheet, 2);
    return newSell;
}

// Operation type 4 - Selling for sablecoin
// Line +1 : equivalent in R$ of the cryptocoin's sell
// Line +3 : purchase of stablecoin, using the equivalent in R$ from the cryptocoin's sell
function opTypeFour(worksheet) {
    parser.moveLines(1);
    const newSell = logSell(worksheet, 4);
    parser.moveLines(1);
    const newBuy = logBuy(worksheet, 4);
    return [newSell, newBuy];
}

// Operation type 5 - Permute of cryptocoin with another
// Line +1 : equivalent in R$ of the cryptocoin's sell
// Line +3 : purchase of cryptocoin, using the equivalent in R$ from the cryptocoin's sell
function opTypeFive(worksheet) {
    parser.moveLines(1);
    const newSell = logSell(worksheet, 4);
    parser.moveLines(1);
    const newBuy = logBuy(worksheet, 4);
    return [newSell, newBuy];
}

workbook.xlsx.readFile('Criptos.xlsx').then(() => {
    console.log("Read file start");
    const worksheet = workbook.worksheets[0];

    // Better change to a loop?
    // Also, all those callings can be resumed, there are operation that are, in this code, the same
    function parsing() {
        const cell = worksheet.getCell(parser.pos()).value;
        console.log(parser.pos(), cell);
        if (cell >= 0) {
            if (cell === 1) {
                const op = opTypeOne(worksheet);
                const cryptoName = op.asset;
                console.log("crypto coin bought:", cryptoName); 
                cryptosBuyList[cryptoNamesList.findIndex((name) => name === cryptoName)].push(op);
            }
            else if (cell === 2) {
                const ops = opTypeTwo(worksheet);
                const cryptoSoldName = ops[0].asset;
                const cryptoBoughtName = ops[1].asset;
                console.log("crypto coin sold:", cryptoSoldName);
                console.log("crypto coin bought", cryptoBoughtName);
                cryptosSellList[cryptoNamesList.findIndex((name) => name === cryptoSoldName)].push(ops[0]);
                cryptosBuyList[cryptoNamesList.findIndex((name) => name === cryptoBoughtName)].push(ops[1]);
            }
            else if (cell === 3) {
                const op = opTypeThree(worksheet);
                const cryptoName = op.asset;
                console.log("crypto coin sold:", cryptoName); 
                cryptosSellList[cryptoNamesList.findIndex((name) => name === cryptoName)].push(op);
            }
            else if (cell === 4) {
                const ops = opTypeFour(worksheet);
                const cryptoSoldName = ops[0].asset;
                const cryptoBoughtName = ops[1].asset;
                console.log("crypto coin sold:", cryptoSoldName);
                console.log("crypto coin bought", cryptoBoughtName);
                cryptosSellList[cryptoNamesList.findIndex((name) => name === cryptoSoldName)].push(ops[0]);
                cryptosBuyList[cryptoNamesList.findIndex((name) => name === cryptoBoughtName)].push(ops[1]);
            }
            else if (cell === 5) {
                const ops = opTypeFive(worksheet);
                const cryptoSoldName = ops[0].asset;
                const cryptoBoughtName = ops[1].asset;
                console.log("crypto coin sold:", cryptoSoldName);
                console.log("crypto coin bought", cryptoBoughtName);
                cryptosSellList[cryptoNamesList.findIndex((name) => name === cryptoSoldName)].push(ops[0]);
                cryptosBuyList[cryptoNamesList.findIndex((name) => name === cryptoBoughtName)].push(ops[1]);
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
    console.log(cryptosSellList);
    const data = {
        "purchases" : cryptosBuyList,
        "sellings" : cryptosSellList
    }
    console.log(data);
    const dataJSON = JSON.stringify(data);
    fs.writeFile("data.json", dataJSON, err => {
        if (err) console.log("Write file failed", err);
        else console.log("Write file succeeded");
    })
})