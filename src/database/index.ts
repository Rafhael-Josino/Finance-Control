//const { Pool, Client } = require('pg')

import { Pool, Client } from 'pg';

const pool = new Pool({
    user: 'docker',
    // host: 'database', // for tests when the application is in a container
    host: 'localhost', // for tests when only the databank is in a container
    database: 'fin_ctrl',
    password: 'finctrl',
    port: 5432,
});
/*
pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
});
*/
const client = new Client({
    user: 'docker',
    host: 'database',
    database: 'fin_ctrl',
    password: 'finctrl',
    port: 5432,
});

//client.connect();

try {
    pool.connect();
} catch (err) {
    console.log("Error connecting to databank:");
    console.log(err.message);
}

/*
// Test:

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
    console.log(err ? err.stack : res.rows[0].message) // Hello World!
});
*/
//export { pool, client };

const PG = {
    query: (text: string, params: string[]) => pool.query(text, params)
}

export { PG }


/*
client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
});
*/

// typeorm version 0.2.45
/*
import { createConnection, getConnectionOptions } from "typeorm";

interface iOptions {
    host: string;
}

getConnectionOptions().then(options => {
    const newOptions = options as iOptions;
    newOptions.host = 'database'; // this option must be EXACTLY the name given to the DB's service
    createConnection({
        ...options,
    });
});
*/

// typeorm version 3.4 //
/*
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "postgres",
    port: 5432,
    host: "localhost",
    username: "docker",
    password: "finctrl",
    database: "fin_ctrl"
});
*/