import fs from 'fs';
import { join } from 'path';

export default async function (undo: boolean = false): Promise<void> {
    let migrationsList = JSON.parse(String(fs.readFileSync(join(__dirname, 'migrations.json'))));
    
    console.log("Migrantions found.\n", migrationsList);

    let importPath: string;
    
    if (undo) migrationsList.reverse();

    await migrationsList.reduce(
        async (promise: Promise<void>, migrationName: string): Promise<void> => {
            await promise;
            importPath = join(__dirname, 'migrationFiles', migrationName);
            const { Migration } = require(importPath);
            const migration = new Migration();
            
            if (undo) {
                console.log("Undoing migration", migrationName);
                await migration.down();
            }
            
            else {
                console.log("Starting migration", migrationName);
                await migration.up();
            }
        },
        Promise.resolve()
    );
}