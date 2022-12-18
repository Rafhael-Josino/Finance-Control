import fs from 'fs';
import { join } from 'path';
import recovery from './migrationsBackup';

const migrationsPath = join(__dirname, 'migrations.json');
let migrationsList: string[];

const dirFiles = fs.readdirSync(__dirname);

if (!dirFiles.includes('migrations.json')) {
  fs.writeFileSync(migrationsPath, '[]');
  migrationsList = [];
}
else {
  migrationsList = JSON.parse(String(fs.readFileSync(migrationsPath)));
}

const ddlArg = process.argv[2];

if (!ddlArg) {
  throw new Error("At least one migration file OR 'rollback' OR 'recovery' argument must be present as argument");
}

/**
 * Undo the last migration:
 */
if (ddlArg === "rollback") {
  if (!migrationsList.length) 
    throw new Error("There is no migration done");

  const migrationUndone = migrationsList.pop();

  const importPath = join(__dirname, 'migrationFiles', migrationUndone);

  const { Migration } = require(importPath);

  const migration = new Migration();
  
  migration.down()
  .then(() => {
    fs.writeFile(migrationsPath, JSON.stringify(migrationsList), err => {
      if (err) throw new Error("Error at migrations.json update: " + err.message);

      console.log(`${migrationUndone} migration undone\nMigrations present:\n`, migrationsList);
    })
  })
  .catch((err: Error) => {
    console.log("\x1b[31m%s\x1b[0m", `Error at migration ${ddlArg}:\n`, err.message);
  });
}

/**
 * Execute all migrations according to the migrations.json file
 * This is useful when a new database is used and all the configuration must be done again
 * However, this assumes that the json file is already made, therefore if the user does not have
 * it previously, one suggestion is to make it manually with the migrations in the desired order
 */
else if (ddlArg === "recovery") {
  recovery();
}

/**
 * As with the previous option, it is assumed that the migrations.json file is already present,
 * and with the migrations in the order of installation, but here the _undo_ argment is passed 
 * as true (it's default value is false).
 * In this case, the migrations present will be undone from the last to the first migration,
 * so there is no need of the user modificate the migrations.json file
 */
else if(ddlArg === "clean") {
  recovery(true);
}

/**
 * Execute the new migration:
 */
else {
  if (!dirFiles.includes(ddlArg + '.ts')) 
    throw new Error("There is no correspondent migration file");
  
  if (migrationsList.includes(ddlArg)) 
    throw new Error("Migration already done");
  
  const importPath = join(__dirname, 'migrationFiles', ddlArg);

  migrationsList.push(ddlArg);

  const { Migration } = require(importPath);

  const migration = new Migration();

  migration.up()
  .then(() => {
    fs.writeFile(migrationsPath, JSON.stringify(migrationsList), err => {
      if (err) throw new Error("Error at migrations.json update: " + err.message);

      console.log(`${ddlArg} migration done\nMigrations present:\n`, migrationsList);
    })
  })
  .catch((err: Error) => {
    console.log("\x1b[31m%s\x1b[0m", `Error at migration ${ddlArg}:\n`, err.message);
  });
}

/*
// Migration .ts files model:

import { PG } from '..';

class Migration {
  // Function that will made the desired change in the databank
  async up() {
    await PG.query(
      `
      //POSTGRES QUERY
      `,
      [
        //PARAMS
      ]
      );
    }
    
    async down() {
    // Function that will unmade the change defined above
    await PG.query(
      `
      //POSTGRES QUERY
      `,
      [
        //PARAMS
      ]
    );
  }
}

export { Migration }
 */