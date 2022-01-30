/*
Sheet's columns escription:
A - Date
B - Pair Asset/Coin evaluated
C - Type of operation
D - Operation medium price (formula or direct value)
E - Total bought (formula or direct value -> fix to this)
F - Total sold OR Tax (formula or direct value -> fix to this)
G - Value paid (formula or direct value)
H - Value received
I - New asset's medium price
J - Profit
K - Operation's local

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


function readWorksheet(user, sheetNumber, fs, path, ExcelJS, res) {
    const workbook = new ExcelJS.Workbook();

    // Object that represents a cell of the datasheet
    function Navigator(column, line) {
        this.column = column;
        this.line = line;
        this.pos = () => {return this.column + this.line}
        this.moveLines = (move) => {this.line += move;}
        this.moveToColumn = (toColumn) => {this.column = toColumn;}
    }

    // Obs: Change name
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

    function CryptoSoldLog(index, date, quant, price) {
        this.index = index;
        this.date = date;
        this.quant = quant;
        this.price = price;
    }

    // The parser, as a global instance of an object, may have not necessity of being called in functions
    // Test this with function opTypeOne
    const parser = new Navigator('B', 2);
    const matchCrypto = new RegExp('\\w+');
    const cryptoInBRL = new RegExp('\\w+/BRL'); // In this case is used the FIAT coin BRL as parameter (brazillian coin)
    const cryptoNamesList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX", "BUSD"];
    const cryptosBuyList = [[], [], [], [], [], [], [], [], []];
    const cryptosSellList  = [[], [], [], [], [], [], [], [], []];

    // ############################### Log Functions #############################
    // Each log function is called when the parser is already in its line from the sheet

    // Check if the whole process of create a CryptoSell object, present so far in the function opTypeTwo, can be separeted in another function
    // and then called in the operationTypes functions
    // By this line of thought, could be a Buy logging function, if each buying is in essence, the same process, and the operations functions
    // just parser each operation and call the pertinent logging function at each datasheet line
    // The logging functions return then the a CryptoSell or CryptoBuy object.

    function logBuy(worksheet) {
        parser.moveToColumn('A');
        const date = worksheet.getCell(parser.pos()).value;

        parser.moveToColumn('B');
        const asset = worksheet.getCell(parser.pos()).value.match(matchCrypto)[0];
        
        parser.moveToColumn('D');
        let purchaseMediumPrice; 
        purchaseMediumPrice = worksheet.getCell(parser.pos()).value.result;
        if (!purchaseMediumPrice) purchaseMediumPrice = worksheet.getCell(parser.pos()).value;
        
        parser.moveToColumn('K');
        const local = worksheet.getCell(parser.pos()).value;
        
        parser.moveToColumn('E');
        let totalBought;
        totalBought = worksheet.getCell(parser.pos()).value.result;
        if (!totalBought) totalBought = worksheet.getCell(parser.pos()).value;

        parser.moveToColumn('F');
        let tax;
        tax = worksheet.getCell(parser.pos()).value.result;
        if (!tax) tax = worksheet.getCell(parser.pos()).value;

        parser.moveToColumn('I');
        let newMediumPrice;
        newMediumPrice = worksheet.getCell(parser.pos()).value.result; // Yet to test
        // If the cell has a value not calculated by formula
        if (!newMediumPrice) newMediumPrice = worksheet.getCell(parser.pos()).value;

        const newOp = new CryptoOperation(date, asset, local, totalBought, purchaseMediumPrice, tax, newMediumPrice);
        return newOp;
    }

    function logSell(worksheet) {
        parser.moveToColumn('A');
        const sellingDate = worksheet.getCell(parser.pos()).value;

        parser.moveToColumn('B');
        const asset = worksheet.getCell(parser.pos()).value.match(matchCrypto)[0];

        parser.moveToColumn('K');
        const local = worksheet.getCell(parser.pos()).value;

        parser.moveToColumn('F');
        let sellingQuant;
        sellingQuant = worksheet.getCell(parser.pos()).value.result;
        if (!sellingQuant) sellingQuant = worksheet.getCell(parser.pos()).value;

        parser.moveToColumn('H');
        let received;
        received = worksheet.getCell(parser.pos()).value.result;
        if (!received) received = worksheet.getCell(parser.pos()).value;

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
                        i,
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
                        i,
                        cryptosBuyList[indexCrypto][i].date, 
                        cryptosBuyList[indexCrypto][i].remainQuant, 
                        cryptosBuyList[indexCrypto][i].purchaseMediumPrice)
                    );
                    cryptosBuyList[indexCrypto][i].remainQuant = 0; // Updates the quantity remanescent, which is 0 in this case
                    debit = -leftOver; // Updates the debit
                }
            }
        }

        const newSell = new CryptoSell(sellingDate, asset, local, received, "see buyIndexes", aquisitionValue, sellingQuant, buyIndexes, leftOver);
        return newSell;
    }

    // test!
    const pathName = path.join(__dirname, "cryptoLogs", user, "cryptos.xlsx");

    workbook.xlsx.readFile(pathName).then(() => {
        console.log("Parsing started");
        console.log(workbook.worksheets.length, "sheets in archive");
        const worksheet = workbook.worksheets[sheetNumber];

        function parsing() {
            const cell = worksheet.getCell(parser.pos()).value;

            // console.log(parser.pos()); // Used to find lines in the table with problemn
            // If this line contains an operation with values equivalent in BRL
            if (cell === null || cell === "STOP") {
                console.log("Parsing finished");
            }

            else if (cell.match(cryptoInBRL)) {
                parser.moveToColumn('C');
                const operationType = worksheet.getCell(parser.pos()).value;
                if (operationType === "Compra") { // Purchase
                    const newOp = logBuy(worksheet);
                    cryptosBuyList[cryptoNamesList.findIndex((name) => name === newOp.asset)].push(newOp);
                }
                else if (operationType === "Venda") { // Sell
                    const newOp = logSell(worksheet)
                    cryptosSellList[cryptoNamesList.findIndex((name) => name === newOp.asset)].push(newOp);
                }
                parser.moveToColumn('B');
                parser.moveLines(1);
                parsing();
            }

            else {
                parser.moveLines(1);
                parsing();
            }
        }
        parsing()

        //console.log(cryptosBuyList);
        //console.log(cryptosSellList);
        const dataJSON = {
            "purchases" : cryptosBuyList,
            "sellings" : cryptosSellList
        }
        //console.log(data);
        
        
        const data = JSON.stringify(dataJSON);
        const namePath = path.join(__dirname, "cryptoLogs", user, `sheet${sheetNumber}.json`);
        fs.writeFile(namePath, data, err => {
            if (err) {
                console.log("Write file failed", err);
                res.status(500).json({ error: "Error at writing file: " + err })
            }
            else {
                console.log(`sheet${sheetNumber}.json written successfully`);
                res.status(201).send(data);
            }
        })
    }).catch(err => {
        console.log("Error reading cryptos.xlsx:", err.message);
        res.status(500).json({ error: "Error reading cryptos.xlsx: " + err.message });
    })
}

module.exports = { readWorksheet }