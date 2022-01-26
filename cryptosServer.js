const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { readWorksheet } = require('./parser.js');

//test - delete these two lines later
//readWorksheet(1, fs, path, ExcelJS);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/index.css', (req, res) => {
	const options = {
		root: __dirname
	}
	res.sendFile("index.css", options, (err) => {
		if (err) console.log("error sendFile");
		else console.log("index.css sent");
	})
});


app.get('/index', (req, res) => {
	fs.readFile('./index.html', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos index:", err);
		else {
			console.log("Sending index.html");
			res.send(data);
		}
	})
})

app.get('/images/:image', (req, res) => {
	console.log("Loading image", req.params.image);
	const namePath = path.join(__dirname, req.params.image);
	fs.readFile(namePath, (err, data) => {
		if (err) console.log("Error:", err);
		else {
			console.log("Sending image", req.params.image);
			res.send(data);
		}
	})
})

/* --------------------- Crypto Operations ---------------------- */

app.get('/cryptos', (req, res) => {
	fs.readFile('./cryptos.html', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos file:", err);
		else {
			console.log("Sending cryptos.js");
			res.send(data);
		}
	})
})

app.get('/cryptos.js', (req, res) => {
	fs.readFile('./cryptos.js', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos code:", err);
		else {
			console.log("Sending cryptos.js");
			res.send(data);
		}
	})
})

// Old - delete later
app.get('/operations', (req, res) => {
	fs.readFile('./data.json', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos file:", err);
		else {
			console.log("Sending data.json");
			res.send(data);
		}
	});
});

app.get('/operations/:sheetNumber', (req, res) => {
	const { sheetNumber } = req.params;
	const pathName = path.join(__dirname, "cryptoLogs", "sheet" + sheetNumber + ".json");
	fs.readFile(pathName, 'utf8', (err, data) => {
		if (err) {
			console.log("Error reading cryptos file:", err);
			res.status(500).json({error: "Error reading cryptos file:" + err.message});
		}
		else {
			console.log("Sending:", pathName);
			res.send(data);
		}
	});
});

app.put('/updateSheet/:sheetNumber', (req, res) => {
	const { sheetNumber } = req.params;
	const status = readWorksheet(sheetNumber, fs, path, ExcelJS, res);
	//res.status(status).send();
})

/* --------------------- Finances ---------------------- */

// Part of the study with the Rocketseat project
app.get('/finances', (req, res) => {
	fs.readFile('./finances.html', 'utf8', (err, data) => {
		if (err) console.log("Error reading finances:", err);
		else {
			console.log("Sending finances.html");
			res.send(data);
		}
	})
})

app.get('/finances.js', (req, res) => {
	fs.readFile('./finances.js', 'utf8', (err, data) => {
		if (err) console.log("Error reading finance.js code:", err);
		else {
			console.log("Sending finances.js");
			res.send(data);
		}
	})
})

app.get('/transactionsLog', (req, res) => {
	const fileName = path.join(__dirname, 'logs', 'transactions.json');
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
	const fileName = path.join(__dirname, 'logs', 'transactions.json');
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
	const fileName = path.join(__dirname, 'logs', 'transactions.json');
	
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
			newData = JSON.stringify(oldData);
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
	const fileName = path.join(__dirname, 'logs', 'transactions.json')
	
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

app.listen(8000, () => console.log("listening"));
