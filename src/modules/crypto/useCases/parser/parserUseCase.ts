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
*/

import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { inject, injectable } from 'tsyringe';
import { 
    CryptoPurchase,
    CryptoSell,
    CryptoPurchasesList,
    CryptoSellsList,
    CryptoSheet,
    CryptoPurchaseSellList 
} from "../../infra/postgresSQL/models/Cryptos"; // BAD?
import { 
    ICryptoRepository,
} from '../../repositories/ICryptoRepository';
import { AppError } from '@shared/errors/AppErrors';

interface IRequest {
    username: string | string[];
    userID: string;
    overwrite: string;
}

@injectable()
class ParserCryptoUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    // If this code will be used as a repository class, the return shall be an object with status e possible ok/error messages
    async execute( { username, userID, overwrite }: IRequest ): Promise<string[]> {

        if (overwrite !== "yes" && overwrite !== "no")
            throw new AppError("overwrite parameter must be 'yes' or 'no'", 400);

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
        
        const parser = new Navigator('B', 2);
        const matchCrypto = new RegExp('\\w+');
        const cryptoInBRL = new RegExp('\\w+/BRL'); // In this case is used the FIAT coin BRL as parameter (brazillian coin)

        // Declared here as global variables
        let cryptoPurchasesList: CryptoPurchasesList;
        let cryptoSellsList: CryptoSellsList;
        let cryptoRelationList: CryptoPurchaseSellList;
        

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
            let purchaseMediumPrice: number; 
            purchaseMediumPrice = worksheet.getCell(parser.pos()).value.result;
            if (!purchaseMediumPrice) purchaseMediumPrice = worksheet.getCell(parser.pos()).value;
            
            parser.moveToColumn('K');
            const local = worksheet.getCell(parser.pos()).value;
            
            parser.moveToColumn('E');
            let totalBought: number;
            totalBought = worksheet.getCell(parser.pos()).value.result;
            if (!totalBought) totalBought = worksheet.getCell(parser.pos()).value;
    
            parser.moveToColumn('F');
            let tax: number;
            tax = worksheet.getCell(parser.pos()).value.result;
            if (!tax) tax = worksheet.getCell(parser.pos()).value;
    
            parser.moveToColumn('I');
            let newMediumPrice: number;
            newMediumPrice = worksheet.getCell(parser.pos()).value.result; // Yet to test
            // If the cell has a value not calculated by formula
            if (!newMediumPrice) newMediumPrice = worksheet.getCell(parser.pos()).value;
            
            const remainQuant = totalBought - tax;

            const newOp = new CryptoPurchase();
            Object.assign(newOp, {
                date,
                asset,
                local,
                totalBought,
                purchaseMediumPrice,
                tax,
                remainQuant,
                newMediumPrice
            });
           
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
            let received: number;
            received = worksheet.getCell(parser.pos()).value.result;
            if (!received) received = worksheet.getCell(parser.pos()).value;
    
            let leftOver: number; // in cryptos
            //let debit = quantSold; // in cryptos
            let aquisitionValue = 0; // in FIAT coin
            let buyIndexes = [];

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

        function parsing(worksheet: ExcelJS.Worksheet): CryptoSheet {
            const cell = worksheet.getCell(parser.pos()).value;
            // console.log(parser.pos()); // Used to find lines in the table with problemn

            // If this line contains an operation with values equivalent in BRL
            if (cell === null || cell === "STOP") {
                console.log("Parsing finished");
                const cryptoSheet = new CryptoSheet();

                // Save last line parsed - parser.line
                Object.assign(cryptoSheet, {
                    cryptoPurchasesList,
                    cryptoSellsList,
                    //cryptoRelationList,
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
                    //cryptoPurchasesList[newOp.asset].push(newOp);
                    cryptoPurchasesList.addPurchase(newOp);
                }
                else if (operationType === "Venda" || operationType === "Transf") { // Sell
                    const newOp = logSell(worksheet);
                    //cryptoSellsList[newOp.asset].push(newOp);
                    cryptoSellsList.addSell(newOp);
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

        /**
         // Recursive function to update purchases object whose assets were sold
         // Each recursion iteration corresponds to a CryptoPurchase object that is been sold (totally or partially);
         */
        function updatePurchases (asset: string, purchaseIndex: number, sell_id: string, debit: number): number {
            if (cryptoPurchasesList.assets[asset][purchaseIndex].remainQuant) {
                const leftOver = cryptoPurchasesList.assets[asset][purchaseIndex].remainQuant - debit;

                // If the quantity of this purchase covers the sell (totally or with a rest)
                if (leftOver >= 0) {
                    // Fill an entry of the purchase/sell relation table
                    cryptoRelationList.addRelation({
                        asset,
                        purchase_id: cryptoPurchasesList.assets[asset][purchaseIndex].purchase_id,
                        sell_id,
                        quantSold: debit
                    });
                    
                    // Update the quantity of cryptocoins present in the CryptoPurchase object sold
                    cryptoPurchasesList.assets[asset][purchaseIndex].remainQuant = leftOver;
                   
                    // Returns the index of CryptoPurchasesList where the last sell was made
                    // The next sell shall start from this point in the CryptoPurchasesList's array (assets's property)
                    return purchaseIndex;
                }

                // If the buying cannot cover the sell and the next one must be checked
                else {
                    // Fill an entry of the purchase/sell relation table
                    cryptoRelationList.addRelation({
                        asset,
                        purchase_id: cryptoPurchasesList.assets[asset][purchaseIndex].purchase_id,
                        sell_id,
                        quantSold: cryptoPurchasesList.assets[asset][purchaseIndex].remainQuant
                    });
                    
                    // Update the quantity of cryptocoins present in the CryptoPurchase object sold
                    cryptoPurchasesList.assets[asset][purchaseIndex].remainQuant = 0;

                    // Calls a new recursion to retrieve the remanescent cryptocoins from the next(s) purchase(s)
                    // The purchaseIndex passed is incremented in one (1) to verify the consecutive purchase and
                    // The value of the debit passed is the rest to be quited (in cryptocoins, not its value in FIAT money)
                    return updatePurchases(asset, ++purchaseIndex, sell_id, -leftOver);
                }
            }
            // The verified purchase has not cryptocoins registerd to be sold, so the next one will be checked
            else {
                return updatePurchases(asset, ++purchaseIndex, sell_id, debit);
            }
        }



        /**
         * Parsing xlsx file:
         */

        //const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${username}.xlsx`);
        const logsPath = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos');
        const dirFiles = fs.readdirSync(logsPath, 'utf8');

        if (!dirFiles.includes(`${username}.xlsx`)) throw new AppError(
            `File ${username}.xlsx not found`,
            404
        );

        const pathName = path.join(logsPath, `${username}.xlsx`)
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathName);
        const cryptoSheetList = [];
    
        const listSheetsResponse = await this.cryptoRepository.listSheets(userID);

        await workbook.worksheets.reduce(
            async (promise, worksheet) => {
                await promise;

                const alreadyParsed = listSheetsResponse.includes(worksheet.name);

                if (!alreadyParsed || (alreadyParsed && overwrite === 'yes')) {
                    if (alreadyParsed) {
                        await this.cryptoRepository.deleteSheet({ userID, sheetName: worksheet.name});
                    }
                    // "Resets" the variables below to start a new sheet parsing process
                    // Better make a new instance or create a reset method likewise parser object?
                    cryptoPurchasesList = new CryptoPurchasesList();
                    cryptoSellsList = new CryptoSellsList();
                    cryptoRelationList = new CryptoPurchaseSellList();
                    parser.reset();
                    
                    console.log(`Parsing of ${worksheet.name} started`);
                    //cryptoSheetList.push(parsing(worksheet));
                    const cryptoSheet = parsing(worksheet);
                    
                    cryptoSellsList.presentAssets().forEach(asset => {
                        // Each reduce iteration corresponds to a CryptoSell object 
                        cryptoSellsList.assets[asset].reduce(
                            (purchaseIndex: number, cryptoSell: CryptoSell): number => { 
                                return updatePurchases(asset, purchaseIndex, cryptoSell.sell_id, cryptoSell.quantSold);
                            },
                            0
                        );
                    });
                        
                    Object.assign(cryptoSheet, { cryptoRelationList });

                    cryptoSheetList.push(cryptoSheet);
                }
            },
            Promise.resolve()
        );
        
        return await this.cryptoRepository.postSheet({ userID, cryptoSheetList });
    }
}

export { ParserCryptoUseCase };