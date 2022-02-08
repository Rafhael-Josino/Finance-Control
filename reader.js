const fs = require('fs');

fs.readFile("data.json", "utf8", (err, data) => {
    if (err) console.log("Error reading purchases.json:", err);
    else {
        console.log(typeof data);
        console.log(data);
    }
})