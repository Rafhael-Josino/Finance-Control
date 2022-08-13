import { hash } from 'bcrypt';
import { PG } from ".";

console.log('teste');

async function create() {
    console.log("func create");

    const user_name = "admin";
    const password = '12345';

    const passwordHash = await hash(password, 8);
    
    await PG.query(
        `INSERT INTO users (user_name, password, isadmin) VALUES ($1, $2, true)`,
        [user_name, passwordHash]
    );
}

create().then(() => console.log("User admin created"));
