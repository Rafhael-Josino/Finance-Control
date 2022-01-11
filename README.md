# Resume

This project aims my practice with Development, building up applications that stores and handles financial transactions:
- Index (to be changed): Code that reads a datasheet (.xlsx file) of predetermined format to calculate gains and losses of transactions with criptocoins
- Finances: Stores the log of general transactions (e.g. salary, groceries shops...) one each time (This is part of a project of the Rocketseat Maratona Discovery - https://app.rocketseat.com.br/node/maratona-discover-edicao-01, adapted with some modifications)

# TO DO

- Make an inital page that directs to the desired application (so far there are general transactions logging and criptocoins transactions organizer);
- Write down how contability of gains and losses is considered here;
- Put json file generation as an option in the crypto transactions application;
- Make another json file containing the final situation of each year. This file should be used to parser from a determined year without having to parser all the previous years
- Verify use of time interval to calculate gains and losses inside given interval
- Expand to other classes of assets (the main objective of this code is for cripto transactions)
- Insert json files with exemplary transactions for users run tests

# Contability of gains and losses

- FIFO (first in first out)

# Dependencies

- https://github.com/exceljs/exceljs

# Images 

- https://icon-library.com/png/357188.html
- https://icon-library.com/icon/bitcoin-icon-22.html
- https://icon-library.com/icon/ethereum-icon-28.html
- https://www.iconpacks.net/free-icon-pack/cryptocurrencies-105.html

# Observations

- The parser code must run before the cryptocoins application, so the json files are ready beforehand