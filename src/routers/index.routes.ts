import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const indexRoutes = Router();

indexRoutes.get('/index', (req, res) => {
    const namePath = path.join(__dirname, '..', 'index.html');
	fs.readFile(namePath, 'utf8', (err, data) => {
		if (err) {
            console.log("Error reading index page file:", err);
            res.status(500).json({ error: "Error reading index: " + err.message });
        }
        else {
			console.log("Sending index.html");
			res.send(data);
		}
	})
});

indexRoutes.get('/index.css', (req, res) => {
    const namePath = path.join(__dirname, '..', 'index.css');
    res.sendFile(namePath, (err) => {
        if (err) {
            console.log("Error reading css index:", err);
            res.status(500).json({ error: "Error reading index: " + err.message });
        }
        else {
            console.log("index.css sent");
        }
    })
});

export { indexRoutes }