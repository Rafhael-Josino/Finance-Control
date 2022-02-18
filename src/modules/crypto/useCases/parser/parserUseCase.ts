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

import path from 'path';
import ExcelJS from 'exceljs';
import { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellsList, CryptoSheet } from "../../models/Cryptos"; // BAD?
import { ICryptoRepository } from '../../repositories/ICryptoRespository';
import { Response } from 'express' // BAD

interface IRequest {
    userName: string;
    sheetNames?: string[];
    res: Response; // BAD
}

class ParserCryptoUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    execute({ userName, sheetNames, res }: IRequest): void {
        const workbook = new ExcelJS.Workbook();

        // Object that represents a cell of the datasheet
        function Navigator(column: string, line: number): void {
            this.column = column;
            this.line = line;
            this.pos = (): string => {return this.column + this.line}
            this.moveLines = (move: number): void => {this.line += move;}
            this.moveToColumn = (toColumn: string): void => {this.column = toColumn;}
            this.reset = (): void => {
                this.column = 'B';
                this.line = 2;
            }
        }
    
        // Probably to be removed - make more tests to substituting object
    /*
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
    */
        // Probably to be removed - test new object
        /*
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
    */
        const parser = new Navigator('B', 2);
        const matchCrypto = new RegExp('\\w+');
        const cryptoInBRL = new RegExp('\\w+/BRL'); // In this case is used the FIAT coin BRL as parameter (brazillian coin)


        // Probably to be removed or changed to an object
        const cryptoNamesList = ["BTC", "ETH", "LTC", "EOS", "USDT", "TUSD", "USDC", "PAX", "BUSD"];
        //const cryptosBuyList = [[], [], [], [], [], [], [], [], []]; // Make more tests with CryptoPurchase
        const cryptosSellList  = [[], [], [], [], [], [], [], [], []];

        // Declared here as global variables
        let cryptoPurchasesList: CryptoPurchasesList;
        let cryptoSellsList: CryptoSellsList;

        // To be removed
        //const cryptoPurchasesList = new CryptoPurchasesList;


 
        // ############################### Log Functions #############################
        // Each log function is called when the parser is already in its line from the sheet
    
        // Check if the whole process of create a CryptoSell object, present so far in the function opTypeTwo, can be separeted in another function
        // and then called in the operationTypes functions
        // By this line of thought, could be a Buy logging function, if each buying is in essence, the same process, and the operations functions
        // just parser each operation and call the pertinent logging function at each datasheet line
        // The logging functions return then the a CryptoSell or CryptoBuy object.
    
        function logBuy(worksheet: any): CryptoPurchase {
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
    
            //const newOp = new CryptoOperation(date, asset, local, totalBought, purchaseMediumPrice, tax, newMediumPrice);
            //return newOp;
            /*
            const remainQuant = totalBought - tax;
            return {date, asset, local, totalBought, purchaseMediumPrice, tax, remainQuant, newMediumPrice};
            */
            
            const remainQuant = totalBought - tax;
            
            const newOp = new CryptoPurchase();
            Object.assign(newOp, {date, asset, local, totalBought, purchaseMediumPrice, tax, remainQuant, newMediumPrice});
           
            return newOp;
            
        }
    
        function logSell(worksheet: any): CryptoSell {
            parser.moveToColumn('A');
            const sellingDate = worksheet.getCell(parser.pos()).value;
    
            parser.moveToColumn('B');
            const asset = worksheet.getCell(parser.pos()).value.match(matchCrypto)[0];
    
            parser.moveToColumn('K');
            const local = worksheet.getCell(parser.pos()).value;
    
            parser.moveToColumn('F');
            let quantSold: number;
            quantSold = worksheet.getCell(parser.pos()).value.result;
            if (!quantSold) quantSold = worksheet.getCell(parser.pos()).value;
    
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
            
            let leftOver: number; // in cryptos
            let debit = quantSold; // in cryptos
            let aquisitionValue = 0; // in FIAT coin
            let buyIndexes = [];
            // Searches for the first purchase operation that still has a remanescent value
            // Insert check code to define "i", depending on previous sells with leftOvers

            //for (let i = 0; i < cryptosBuyList[indexCrypto].length; i++) {
            for (let i = 0; i < cryptoPurchasesList[asset].length; i++) {


                //if (cryptosBuyList[indexCrypto][i].remainQuant) {
                if (cryptoPurchasesList[asset][i].remainQuant) {
                    //leftOver = cryptosBuyList[indexCrypto][i].remainQuant - debit;
                    leftOver = cryptoPurchasesList[asset][i].remainQuant - debit;
                    // If the quantity of this purchase covers the sell (totally or the with a rest)
                    if (leftOver >= 0) {
                        //cryptosBuyList[indexCrypto][i].remainQuant = leftOver; // Updates the quantity remanescent
                        cryptoPurchasesList[asset][i].remainQuant = leftOver; // Updates the quantity remanescent
                        // Aquisition value = this purchase medium price * quantity bought + previous purchase's values
                        //aquisitionValue += cryptosBuyList[indexCrypto][i].purchaseMediumPrice * debit; 
                        aquisitionValue += cryptoPurchasesList[asset][i].purchaseMediumPrice * debit; 
                        /*
                        buyIndexes.push(new CryptoSoldLog(
                            i,
                            cryptosBuyList[indexCrypto][i].date, 
                            debit, 
                            cryptosBuyList[indexCrypto][i].purchaseMediumPrice)
                        );
                        */
                        buyIndexes.push(
                            {
                                index: i,
                                date: cryptoPurchasesList[asset][i].date, 
                                quant: debit, 
                                price: cryptoPurchasesList[asset][i].purchaseMediumPrice
                            }
                        );
                        break;
                    }
                    // If the buying cannot cover the sell and the next(s) one(s) must be checked
                    else {
                        //aquisitionValue += cryptosBuyList[indexCrypto][i].purchaseMediumPrice * cryptosBuyList[indexCrypto][i].remainQuant;
                        aquisitionValue += cryptoPurchasesList[asset][i].purchaseMediumPrice * cryptoPurchasesList[asset][i].remainQuant;
                        /*
                        buyIndexes.push(new CryptoSoldLog(
                            i,
                            cryptosBuyList[indexCrypto][i].date, 
                            cryptosBuyList[indexCrypto][i].remainQuant, 
                            cryptosBuyList[indexCrypto][i].purchaseMediumPrice)
                        );
                            */
                        buyIndexes.push(
                            {
                                index: i,
                                date: cryptoPurchasesList[asset][i].date, 
                                quant: debit, 
                                price: cryptoPurchasesList[asset][i].purchaseMediumPrice
                            }
                        );
                        //cryptosBuyList[indexCrypto][i].remainQuant = 0; // Updates the quantity remanescent, which is 0 in this case
                        cryptoPurchasesList[asset][i].remainQuant = 0; // Updates the quantity remanescent, which is 0 in this case
                        debit = -leftOver; // Updates the debit
                    }
                }
            }
    
            //const newSell = new CryptoSell(sellingDate, asset, local, received, "see buyIndexes", aquisitionValue, sellingQuant, buyIndexes, leftOver);
            //return newSell;

            //(sellingDate, asset, local, received, aquisitionDate, aquisitionValue, quantSold, buyIndexes, leftOverQuant)
            /*
            return {
                sellingDate,
                asset,
                local,
                received,
                quantSold,
                aquisitionDate: "See buy indexes",
                aquisitionValue,
                buyIndexes,
                leftOver
            }
            */

            const newSell = new CryptoSell();
            Object.assign(newSell, {
                sellingDate,
                asset,
                local,
                received,
                quantSold,
                aquisitionDate: "See buy indexes",
                aquisitionValue,
                buyIndexes,
                leftOver
            });

            return newSell;
        }
    
      
        // Must return a array of CryptoSheet objects
        // The repository will add and update the corresonding sheets, after read the user file
        // Afterwards, the repository will save the updated information

        // The objects cryptoPurchasesList will be defined only inside parsing function
        // There will be a global array of CryptoSheet objects
        
        
        
        // the purchase and sell lists objects must be passed as arguments to parsing
        // that being, the are only created inside the functions that calls parsing
        function parsing(worksheet: any): CryptoSheet {
            
            const cell = worksheet.getCell(parser.pos()).value;

            // console.log(parser.pos()); // Used to find lines in the table with problemn
            // If this line contains an operation with values equivalent in BRL
            if (cell === null || cell === "STOP") {
                console.log("Parsing finished");
                const cryptoSheet = new CryptoSheet();
                Object.assign(cryptoSheet, {
                    cryptoPurchasesList,
                    cryptoSellsList,
                    sheetName: worksheet.name,
                    created_at: new Date(),
                });
                return cryptoSheet;
            }

            else if (typeof cell !== "string") {
                parser.moveLines(1);
                return parsing(worksheet);
            }

            else if (cell.match(cryptoInBRL)) {
                parser.moveToColumn('C');
                const operationType = worksheet.getCell(parser.pos()).value;
                if (operationType === "Compra") { // Purchase
                    const newOp = logBuy(worksheet);
                    //cryptosBuyList[cryptoNamesList.findIndex((name) => name === newOp.asset)].push(newOp);

                    cryptoPurchasesList[newOp.asset].push(newOp);
                }
                else if (operationType === "Venda") { // Sell
                    const newOp = logSell(worksheet);
                    //cryptosSellList[cryptoNamesList.findIndex((name) => name === newOp.asset)].push(newOp);

                    cryptoSellsList[newOp.asset].push(newOp);
                }
                parser.moveToColumn('B');
                parser.moveLines(1);
                return parsing(worksheet);
            }

            else {
                parser.moveLines(1);
                return parsing(worksheet);
            }
        }


        // Parsing xlsx file:
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.xlsx`);

        workbook.xlsx.readFile(pathName).then(() => {
            console.log("Parsing started");
            console.log("Sheets in archive:", sheetNames);
            const cryptoSheetList = [];
            
            workbook.worksheets.forEach(worksheet => {
                // "Resets" the variables below to start a new sheet parsing process

                // Better make a new instance or create a reset method likewise parser object?
                cryptoPurchasesList = new CryptoPurchasesList();
                cryptoSellsList = new CryptoSellsList();
                parser.reset();

                // If the request contains the names of certain sheets, only those will be parsed
                if (sheetNames) {
                    if (sheetNames.includes(worksheet.name)) {
                        cryptoSheetList.push(parsing(worksheet));
                    }
                }

                // Case none names were passed, all sheets will be parsed
                else {
                    cryptoSheetList.push(parsing(worksheet));                
                }
            });

            this.cryptoRepository.postSheetOperations({ userName, cryptoSheetList, res});
            //this.cryptoRepository.postSheetOperations({ user, sheetName, cryptosBuyList, cryptosSellList});
            //this.cryptoRepository.postSheetOperations({ user, sheetName, cryptoPurchasesList, res } );
        
        }).catch(err => {
            console.log("Parsing failed:");
            console.log(err);
            res.status(500).json({ error: err.message});
        });

    }
}

export { ParserCryptoUseCase };