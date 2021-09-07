const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/operations', (req, res) => {
	fs.readFile('./data.json', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos file:", err);
		else {
			console.log("Sending data.json");
			res.send(data);
		}
	});
});

app.get('/cryptos.js', (req, res) => {
	fs.readFile('./cryptos.js', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos code:", err);
		else {
			console.log("Sending cryptos.js");
			res.send(data);
		}
	})
})

app.get('/index', (req, res) => {
	fs.readFile('./index.html', 'utf8', (err, data) => {
		if (err) console.log("Error reading cryptos index:", err);
		else {
			console.log("Sending index.html");
			res.send(data);
		}
	})
})

app.listen(8000, () => console.log("listening"));
