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

# Use cases

## Create Account

- It should be able to create a new user account;
- It should not be able to create an user account whose username already exists;

## Get Account

- It should be able to get an user account by the user name received;
- It should return status 404 when there is no user account with the user name received;



