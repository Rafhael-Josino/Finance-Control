const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/index.css', (req, res) => {
	var options = {
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

/* --------------------- Finances ---------------------- */

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

app.get('/operations', (req, res) => {
	fs.readFile('./data.json', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos file:", err);
		else {
			console.log("Sending data.json");
			res.send(data);
		}
	});
});

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
	fs.readFile('./transactions.json', 'utf8', (err, data) => {
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
	const fileName = path.join(__dirname, 'transactions.json')
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
	console.log("Edit function:\n", req.body);
	const fileName = path.join(__dirname, 'transactions.json')
	fs.readFile(fileName, 'utf8', (err, data) => {
		const oldData = JSON.parse(data);
		oldData[req.body.transactionsIndex].Description = req.body.Description;
		oldData[req.body.transactionsIndex].Value = req.body.Value;
		oldData[req.body.transactionsIndex].Date = req.body.Date;
		newData = JSON.stringify(oldData);
		fs.writeFile(fileName, newData, err => {
			if (err) console.log("Error at file edition:", err);
			else {
				console.log("File edited");
				res.sendStatus(204);
			}
		})
	})
})

app.delete('/editTransaction', (req, res) => {
	console.log("Delete function for transaction nº: ", req.body.index);
	const fileName = path.join(__dirname, 'transactions.json')
	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) console.log("Error reading file:", err);
		else {
			console.log("Deleting transaction:", req.body.index);
			const oldData = JSON.parse(data);
			oldData.splice(req.body.index, 1);
			const newData = JSON.stringify(oldData);
			fs.writeFile(fileName, newData, err => {
				if (err) console.log("Error at file creation:", err);
				else {
					console.log("File created");
					res.sendStatus(204);
				}
			})
		}
	})
})

app.get('/images/:image', (req, res) => {
	console.log("Loading image", req.params.image);
	let namePath = path.join(__dirname, req.params.image);
	fs.readFile(namePath, (err, data) => {
		if (err) console.log("Error:", err);
		else {
			console.log("Sending image", req.params.image);
			res.send(data);
		}
	})
})

app.listen(8000, () => console.log("listening"));
