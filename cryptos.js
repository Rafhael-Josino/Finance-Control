let menu = document.getElementById("menu");
let purchasesList = document.getElementById("purchasesList");
let sellingsList = document.getElementById("sellingsList");
let purchases, sellings;
let selectCrypto = document.getElementById("selectCrypto");
let currentSitTab = document.getElementById("currentSituationTab");
let currentSitDiv = document.getElementById("currentSituationDiv");
let cryptoImage = document.getElementById("image");

function cryptoLogConstruct(cryptoIndex, purchases, sells) {
	function cryptoLog() {
		purchasesList.textContent = JSON.stringify(purchases[cryptoIndex], undefined, 2);
		sellingsList.textContent = JSON.stringify(sells[cryptoIndex], undefined, 2);
	}
	return cryptoLog;
}

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		const cryptosList = jsonFile.purchases;
		const sellingsTemp = jsonFile.sellings;
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
		}
	})