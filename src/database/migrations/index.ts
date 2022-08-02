import fs from 'fs';
import path from 'path';

const migrationsPath = path.join(__dirname, 'migrations.json');
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
  throw new Error("At least one migration file OR 'rollback' argument must be present as argument");
}
if (ddlArg === "rollback") {
  if (!migrationsList.length) {
    throw new Error("There is no migration done");
  }
  // call down function of last migration done -> unmade it

  const importPath = path.join(__dirname, migrationsList.pop());

  fs.writeFile(migrationsPath, JSON.stringify(migrationsList), async (err) => {
    if (err) throw new Error("Error at migrations.json update: " + err.message);

    const { Migration } = require(importPath);
    const migration = new Migration();
    await migration.down();
    console.log("rollback done");
  })
}
else {
  // do new migration
  if (!dirFiles.includes(ddlArg + '.ts')) {
    throw new Error("There is no correspondent migration file");
  }
  if (migrationsList.includes(ddlArg)) {
    throw new Error("Migration already done");

  }

  const importPath = path.join(__dirname, ddlArg);
  migrationsList.push(ddlArg);

  fs.writeFile(migrationsPath, JSON.stringify(migrationsList), async (err) => {
    if (err) throw new Error("Error at migrations.json update: " + err.message);

    const { Migration } = require(importPath);
    const migration = new Migration();
    await migration.up();
    console.log(`${ddlArg} migration done`);
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