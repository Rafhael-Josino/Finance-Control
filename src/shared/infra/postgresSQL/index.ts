import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

import { AppError } from '@shared/errors/AppErrors';

const database = process.env.NODE_ENV === 'test' ? 'fin_ctrl_test' : 'fin_ctrl';

console.log("database:", database);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

const PG = {
    query: async (text: string, params: string[]): Promise<any> => {
        return pool.connect().then(async client => {
            return client.query(text, params).then(res => {
                client.release();
                
                return res;
            }).catch(err => {
                //client.release();

                throw new AppError(`Error connecting to database\n:${err.message}`, 500);
            })
        })
    }
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