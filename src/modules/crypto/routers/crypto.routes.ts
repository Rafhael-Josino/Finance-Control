import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { parserCryptoController } from '../useCases/parser';

const cryptoRoutes = Router();


// Transform middleware in a repository function that is just imported and called here
// I do not know if it is the correct practice
// but this way, the verification's responsibility passes to be owned by the repository
function verifyUserExists(req: Request, res: Response, next: any): any {
	const { user } = req.body;

	fs.readdir(path.join(__dirname, '..', '..', '..', '..', 'logs'), (err, files) => {
		if (err) {
			console.log("Server here - unable to read directory:", err);
			res.status(500).json({error: "Server here - unable to read directory: " + err.message});
		}
		else {
			console.log(files);
			if (files.includes(user)) {
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

	//const sheetsNames = cryptoRepository.getSheetsNames(user); //How to handle assynchronism?
	
	// Must handle errors
	//res.json({ sheetsNames });
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
	parserCryptoController.handle(req, res);
})

export { cryptoRoutes };