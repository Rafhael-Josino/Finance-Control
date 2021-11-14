# Resume

- Code that reads a datasheet (.xlsx file) of predetermined format to calculate gains and losses of transactions with criptocoins

# TO DO

- Write contability of gains and losses
- Put json file generation as an option in the front end
- Make another json file containing the final situation of each year. This file should be used to parser from a determined year without having to parser all the previous years
- Improve front end appearence
- Change parser method to recongnize an operantion (purchase or sell) in determined FIAT coin using Regular Expression. This way, it will not more necessary to classify the different types of operation.
- Verify use of time interval to calculate gains and losses inside given interval
- Once ready, expand to other classes of assets (the main objective of this code is for cripto transactions)

# Contability of gains and losses

- FIFO (first in first out)

# Dependencies

- https://github.com/exceljs/exceljs

# Images

- https://icon-library.com/png/357188.html
- https://icon-library.com/icon/bitcoin-icon-22.html
- https://icon-library.com/icon/ethereum-icon-28.html
- https://icon-library.com/png/579718.html

# Observations

- The parser code must run before the application, so the json files are ready beforehand