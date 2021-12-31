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

// Yet to be implemented
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
