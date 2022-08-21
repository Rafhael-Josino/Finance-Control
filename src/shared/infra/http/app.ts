import 'reflect-metadata';	
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import { router } from './routers/';
import { AppError } from '@shared/errors/AppErrors';

import '@shared/container';

//import { pool, client } from "./database";
//import { dataSource } from './database'; // to typeorm@0.3.4

//import * as swaggerFile2 from './swagger.json'; // why is not working?

const swaggerPath = path.join(__dirname, 'swagger.json');
const swaggerFile = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
const app = express();

/* --------------------- Middleware -------------------- */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

/* --------------------- Finances ---------------------- */

// Part of the study with the Rocketseat project
app.get('/finances', (req, res) => {
	const namePath = path.join(__dirname, 'finances.html');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) console.log("Error reading finances:", err);
		else {
			console.log("Sending finances.html");
			res.send(data);
		}
	})
})

app.get('/finances.js', (req, res) => {
	const namePath = path.join(__dirname, 'finances.js');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) console.log("Error reading finance.js code:", err);
		else {
			console.log("Sending finances.js");
			res.send(data);
		}
	})
})

app.get('/transactionsLog', (req, res) => {
	const fileName = path.join(__dirname, '..', 'logs', 'transactions.json');
	fs.readFile(fileName, 'utf8', (err, data) => {
		try {
			console.log("Sending transaction log");
			res.send(data);
		} catch (err) {
			console.log("Error sending transaction log or file does not exist");
			res.sendStatus(500);
		}
	})
})

app.post('/newTransaction', (req, res) => {
	console.log("New transaction to be created");
	const fileName = path.join(__dirname, '..', 'logs', 'transactions.json');
	fs.readFile(fileName, 'utf8', (err, data) => {
		let newData;
		if (err) {
			console.log("File not found, error:", err);
			console.log("Attempting to create:");
			console.log(req.body);
			newData = JSON.stringify([req.body]);
		}
		else {
			console.log("Adding data:");
			console.log(req.body);
			const oldData = JSON.parse(data);
			oldData.push(req.body);
			newData = JSON.stringify(oldData);
		}
		fs.writeFile(fileName, newData, err => {
			if (err) console.log("Error at file creation:", err);
			else {
				console.log("File created");
				res.sendStatus(204);
			}
		})
	})
})

app.post('/editTransaction', (req, res) => {
	console.log("Edit Transaction:\n", req.body);
	
	const {Description, Value, Date, transactionsIndex} = req.body;
	const fileName = path.join(__dirname, '..', 'logs', 'transactions.json');
	
	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) {
			console.log("Error reading transaction file:", err);
			res.status(400).json({error: err});
		}
		else {
			const oldData = JSON.parse(data);
			oldData[transactionsIndex].Description = Description;
			oldData[transactionsIndex].Value = Value;
			oldData[transactionsIndex].Date = Date;
			const newData = JSON.stringify(oldData);
			fs.writeFile(fileName, newData, err => {
				if (err) {
					console.log("Error at file edition:", err);
					res.status(400).json({error: err});
				}
				else {
					console.log("File edited");
					res.status(204).send();
				}
			})
		}
	})
})

app.delete('/editTransaction', (req, res) => {
	const {index} = req.body;
	const fileName = path.join(__dirname, '..', 'logs', 'transactions.json')
	
	console.log("Delete function for transaction nº: ", index);
	
	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) {
			console.log("Error reading file:", err);
			res.status(400).json({error: err});
		}
		else {
			console.log("Deleting transaction:", index);
			const oldData = JSON.parse(data);
			oldData.splice(index, 1);
			const newData = JSON.stringify(oldData);
			fs.writeFile(fileName, newData, err => {
				if (err) {
					console.log("Error at file creation:", err);
					res.status(400).json({error: err});
				}
				else {
					console.log("File overwritten");
					res.status(204).send();
				}
			})
		}
	})
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({ message: err.message });
	}
	console.log(err);
	return res.status(500).json({
		status: "error",
		message: `Internal server error - ${err.message}`,
		stack: err.stack
	});
});

export { app };