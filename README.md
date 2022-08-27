# Resume

This project aims to practice Development, building up an application that stores and handles financial transactions:
- Cryptocoins: Reads a datasheet (.xlsx file) of predetermined format to calculate gains, losses and summary of transactions with criptocoins
- Finances: Stores the log of general transactions (e.g. salary, groceries shops...) one each time (This is part of a project of the [Rocketseat Maratona Discovery](https://app.rocketseat.com.br/node/maratona-discover-edicao-01), adapted with some modifications)

# TO DO

- Apply the knowledge leant in the Finances part
- Implement tests with jest
- Write down business rules

# Contability of gains and losses

- FIFO (first in first out): The profit of a sell will consider the prices of the first(s) element(s) bought

# Dependencies

- [exceljs](https://github.com/exceljs/exceljs)

# Modules

## Accounts

- It should be able to create a new user account;
- It should not be able to create an user account whose username already exists;
- It should be able to get an user account by the user name received;
- It should be able to list present accounts;
- It should be able to delete an user account;
- All functionalities from this modules should be allowed only to administrators.

## Cryptocoins

- It should be able to parser the .xlsx file and return the names of the sheets saved;
- It should no be able to execute if the 'overwrite' save sheet route's argument is not [yes/no];
- It should not parse the same sheets if the 'overwrite' argument is passed as 'no'.