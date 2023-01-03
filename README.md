# Resume

This project aims to practice backend development, building up an application that stores and handles financial transactions:
- Cryptocoins: Reads a datasheet (.xlsx file) of predetermined format to calculate gains, losses and summary of transactions with criptocoins;
- Finances: Stores the log of general transactions (e.g. salary, groceries shops...) one each time (This is part of a project of the [Rocketseat Maratona Discovery](https://app.rocketseat.com.br/node/maratona-discover-edicao-01), adapted with some modifications).

# Contability of gains and losses

FIFO (first in first out): A sell's profit will consider the prices of the first(s) element(s) bought instead
of the avarage price so far

# Data Definition Language (PostgresSQL)

Scripts to alter directly the databank. The changes are made through codes following a format, as can be seen
in the ones present at folder ./src/shared/infra/postgresSQL/migrations/migrationFiles/
The changes are recorded in a JSON file with the code archives names in the order of execution.

- To insert new alteration at the databank: `yarn ddl2 MIGRATION_FILE_NAME`
- To rollback last alteration: `yarn ddl2 rollback`
- To insert all alterations if the JSON file is present: `yarn ddl2 recovery`

# Modules

## Accounts

- It should be able to create a new user account;
- It should not be able to create an user account whose username already exists;
- It should be able to get an user account by the user name received;
- It should be able to list present accounts;
- It should be able to delete an user account;

## Cryptocoins

This module is specially regarded in this project, for it was conceived think in a real necessity of me
to organize the logs of my transactions with cryptocoins.
This logs are made in a chronological order, but as each exchange between cryptocoins means a purchase of one
and a sell of the other, it is difficult to track the profits and losses using the methodology described above.

- It should be able to parser the .xlsx file and return the names of the sheets saved;
- It should be able to show the summary of all cryptocoins (total quantity and total value spent to buy);
- It should be able to show the transactions of each cryptocoin;
- It should no be able to execute if the 'overwrite' save sheet route's argument is not [yes/no];
- It should not parse the same sheets if the 'overwrite' argument is passed as 'no'.

### TO DO

- Make a new, more simple parsing code, using a CSV parser library;
- Upload a example .xlsx (or .csv in the future) to better ilustration and testing.

## Transactions

- It should be able to show all saved transactions of an account;
- It should be able to create a new and to edit or delete a existing transaction.