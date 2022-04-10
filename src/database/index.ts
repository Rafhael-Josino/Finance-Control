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
// version 3.4 //
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