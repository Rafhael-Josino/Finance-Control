import fs from 'fs';
import path from 'path';

export default async function (undo = false): Promise<void> {
    let migrationsList = JSON.parse(String(fs.readFileSync(path.join(__dirname, 'migrations.json'))));
    let importPath: string;
    
    if (undo) migrationsList.reverse();

    await migrationsList.reduce(
        async (promise: Promise<void>, migrationName: string): Promise<void> => {
            await promise;
            importPath = path.join(__dirname, migrationName);
            const { Migration } = require(importPath);
            const migration = new Migration();
            if (undo) await migration.down();
            else await migration.up();
        },
        Promise.resolve()
    );
}