# Resume

This project aims to practice Development, building up applications that stores and handles financial transactions:
- Cryptos: Reads a datasheet (.xlsx file) of predetermined format to calculate gains and losses of transactions with criptocoins
- Finances: Stores the log of general transactions (e.g. salary, groceries shops...) one each time (This is part of a project of the Rocketseat Maratona Discovery - https://app.rocketseat.com.br/node/maratona-discover-edicao-01, adapted with some modifications)
- Stocks: More simple, consolidates the current info about present stocks in the wallet from a .xlsx file (where each sheet corresponds to more detailed information and transactions of a single stock);

# TO DO

- Finish integrate typescript
- Add to the transaction elements mentioned above event handlers to touch screen events
- Verify use of time interval to calculate gains and losses inside given interval
- Finish stock functionality
- Insert .xlsx files with exemplary transactions for users run tests

# Contability of gains and losses

- FIFO (first in first out): The profit of a sell will consider the prices of the first(s) element(s) bought

# Dependencies

- https://github.com/exceljs/exceljs