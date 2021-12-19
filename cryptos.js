let menu = document.getElementById("menu");
let purchasesList = document.getElementById("purchasesList");
let sellingsList = document.getElementById("sellingsList");
let purchases, sellings;
let selectCrypto = document.getElementById("selectCrypto");
let currentSitTab = document.getElementById("currentSituationTab");
let currentSitDiv = document.getElementById("currentSituationDiv");
let cryptoImage = document.getElementById("image");
let summaries = [];

function CryptoSituation(name, total, mediumPrice) {
	this.name = name;
	this.total = total;
	this.mediumPrice = mediumPrice;
	this.aquisitionPrice = total * mediumPrice;
}

function cryptoLogConstruct(cryptoIndex, purchases, sells) {
	function cryptoLog() {
		purchasesList.textContent = JSON.stringify(purchases[cryptoIndex], undefined, 2);
		sellingsList.textContent = JSON.stringify(sells[cryptoIndex], undefined, 2);
	}
	return cryptoLog;
}

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		purchases = jsonFile.purchases;
		sellings = jsonFile.sellings;
		let cryptosList = purchases.filter(p => p.length); // Filter out empty lists
		let sellingsTemp = sellings.filter(p => p.length); // WRONG, empty sells doesn't mean that there is no crypto
		console.log(cryptosList);
		const cryptoQuantity = cryptosList.length;
		console.log(cryptoQuantity);
		for (let i = 0; i < cryptoQuantity; i++) {
			let total = 0;
			for (let j = 0; j < cryptosList[i].length; j++) {
				total = total + cryptosList[i][j].remainQuant;
			}
			console.log(cryptosList[i]);
			let newLine = document.createElement("tr");
			newLine.insertCell(-1);
			newLine.lastChild.innerHTML = cryptosList[i][0].asset;
			newLine.insertCell(-1);
			newLine.lastChild.innerHTML = total;
			newLine.insertCell(-1);
			newLine.lastChild.innerHTML = cryptosList[i][cryptosList[i].length-1].newMediumPrice;
			newLine.insertCell(-1);
			newLine.lastChild.innerHTML = total * cryptosList[i][cryptosList[i].length-1].newMediumPrice;
			newLine.setAttribute("class", "newLineClass");
			newLine.addEventListener("click", cryptoLogConstruct(i, cryptosList, sellingsTemp));
			currentSitTab.appendChild(newLine);
			summaries.push(new CryptoSituation(cryptosList[i][0].asset, total, cryptosList[i][cryptosList[i].length-1].newMediumPrice));
		}
	})