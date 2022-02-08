import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { CryptoRepository} from '../repositories/cryptoRepositories';

const cryptoRoutes = Router();
const cryptoRepository = new CryptoRepository();

function verifyUserExists(req, res, next) {
	const { user } = req.headers;

	fs.readdir(path.join(__dirname, '..', 'cryptoLogs'), (err, files) => {
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
				console.log("User does not exist");
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

cryptoRoutes.get('/operations/:sheetNumber', verifyUserExists, (req, res) => {
	//const { user } = req.headers; // headers parameters are considerated as possibles arrays????
	//cont { user } = req; // with middleware. Only this is not working. User not part of req's type
	const { user } = req.body; // Must adjust in crypto.ts
	const { sheetNumber } = req.params
	const sheetOperations = cryptoRepository.getSheetOperations({ user, sheetNumber }); //How to handle assynchronism?
	// Must handle errors
	res.json({ sheetOperations });
});

cryptoRoutes.post('/operations/:sheetNumber', verifyUserExists, (req, res) => {
	//const { user } = req.headers; // headers parameters are considerated as possibles arrays????
	//cont { user } = req; // with middleware. Only this is not working. User not part of req's type
	const { user } = req.body; // Must adjust in crypto.ts
	const { sheetNumber } = req.params
	const sheetOperations = cryptoRepository.putSheetOperations({ user, sheetNumber }); //How to handle assynchronism?
	// Must handle errors
	res.json({ sheetOperations });
})

export { cryptoRoutes }