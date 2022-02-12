import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { CryptoRepositoryJSON } from '../repositories/implementations/CryptoRepositoryJSON';
import { CryptoParser } from '../useCases/parser/parserUseCase';

const cryptoRoutes = Router();

// Using JSON based repositories
const cryptoRepository = new CryptoRepositoryJSON();


function verifyUserExists(req, res, next) {
	const { user } = req.body;

	fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs'), (err, files) => {
		if (err) {
			console.log("Unable to read directory:", err);
			res.status(500).json({error: "Unable to read directory: " + err.message});
		}
		else {
			console.log(files);
			if (files.includes(user)) {
				//req.user = user; // only this is not working
				return next();
			}
			else {
				console.log("Server message: User does not exist");
				return res.status(404).json({error: "User does not exist"});
			}
		}
	})
}

cryptoRoutes.get("/cryptos", (req, res) => {
	const namePath = path.join(__dirname, '..', 'cryptos.html');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) {
            console.log("Error reading cryptos index:", err);
            res.status(500).json({ error: "Error reading index: " + err.message });
        }
        else {
			console.log("Sending cryptos.html");
			res.send(data);
		}
	});
});

cryptoRoutes.get('/cryptos.js', (req, res) => {
	const namePath = path.join(__dirname, '..', 'cryptos.js');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) {
            console.log("Error reading cryptos index:", err);
            res.status(500).json({ error: "Error reading index: " + err.message });
        }
        else {
			console.log("Sending cryptos.js");
			res.send(data);
		}
	});
});

cryptoRoutes.get('/sheets', verifyUserExists, (req, res) => {
	//const { user } = req.headers; // headers parameters are considerated as possibles arrays????
	//cont { user } = req; // with middleware. Only this is not working. User not part of req's type
	const { user } = req.body; // Must adjust in crypto.ts

	const sheetsNames = cryptoRepository.getSheetsNames(user); //How to handle assynchronism?
	
	// Must handle errors
	res.json({ sheetsNames });
});

cryptoRoutes.get('/operations/:sheetName', verifyUserExists, (req, res) => {
	//const { user } = req.headers; // headers parameters are considerated as possibles arrays????
	//cont { user } = req; // with middleware. Only this is not working. User not part of req's type
	const { user } = req.body; // Must adjust in crypto.ts
	const { sheetName } = req.params
	//const sheetOperations = cryptoRepository.getSheetOperations({ user, sheetName }); //How to handle assynchronism?
	// Must handle errors
	//res.json({ sheetOperations });
});

cryptoRoutes.post('/operations/:sheetName', verifyUserExists, (req, res) => {
	//const { user } = req.headers; // headers parameters are considerated as possibles arrays????
	//cont { user } = req; // with middleware. Only this is not working. User not part of req's type
	const { user } = req.body; // Must adjust in crypto.ts
	const { sheetName } = req.params;

	const cryptoParser = new CryptoParser(cryptoRepository);

	cryptoParser.execute({user, sheetName});
	
	// Must handle errors
	// It sends the response before the execute above finishes!!!
	res.status(200).send() // How to synchronize that?
	//res.status(cryptoParser.execute({ user, sheetName })).send();
})

export { cryptoRoutes };