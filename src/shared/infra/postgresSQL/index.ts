import { AppError } from '@shared/errors/AppErrors';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'docker',
    // host: 'database', // for tests when the application is in a container
    host: 'localhost', // for tests when only the databank is in a container
    database: 'fin_ctrl',
    password: 'finctrl',
    port: 5432,
});

const PG = {
    query: async (text: string, params: string[]): Promise<any> => {
        return pool.connect().then(async client => {
            return client.query(text, params).then(res => {
                client.release();
                
                // for tests:
                if (res.rows.length) {
                    console.log("Query:", text, params);
                    console.log("Testing postgres/index", res.rows);
                }

                return res;
            }).catch(err => {
                client.release();

                throw new AppError("Error connecting database", 500);
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