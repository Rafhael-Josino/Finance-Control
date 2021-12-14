let menu = document.getElementById("menu");
let purchasesList = document.getElementById("purchasesList");
let sellingsList = document.getElementById("sellingsList");
let purchases, sellings;
let selectMenu = document.getElementById("selectMenu");
let selectCrypto = document.getElementById("selectCrypto");
let currentSitDiv = document.getElementById("currentSituationDiv");
let cryptoImage = document.getElementById("image");
let summaries = [];

function CryptoSituation(name, total, mediumPrice) {
	this.name = name;
	this.total = total;
	this.mediumPrice = mediumPrice;
	this.aquisitionPrice = total * mediumPrice;
}

function selectCryptoFunc(event) {
	purchasesList.textContent = JSON.stringify(purchases[event.target.value], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[event.target.value], undefined, 2);
	cryptoImage.src="images/" + String(event.target.value);
	cryptoImage.alt="Crypto";
}

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		purchases = jsonFile.purchases;
		sellings = jsonFile.sellings;
		console.log(typeof purchases);
		console.log(typeof sellings);
		let cryptosList = purchases.filter(p => p.length); // Filter out empty lists
		console.log(cryptosList);
		const cryptoQuantity = cryptosList.length; // WRONG
		console.log(cryptoQuantity);
		for (let i = 0; i < cryptoQuantity; i++) {
			let total = 0;
			for (let j = 0; j < cryptosList[i].length; j++) {
				total = total + cryptosList[i][j].remainQuant;
			}
			console.log(cryptosList[i]);
			summaries.push(new CryptoSituation(cryptosList[i][0].asset, total, cryptosList[i][cryptosList[i].length-1].newMediumPrice));
		}
	})

selectMenu.addEventListener("change", (event) => {
	if (event.target.value === "operations") {
		currentSitDiv.innerHTML = null;
		selectCrypto.addEventListener("change", selectCryptoFunc);
	}
	if (event.target.value === "currentSituation") {
		currentSitDiv.innerHTML = JSON.stringify(summaries, undefined, 2);
		purchasesList.textContent = null;
		sellingsList.textContent = null;
		selectCrypto.removeEventListener("change", selectCryptoFunc);
	}
});

selectCrypto.addEventListener("change", selectCryptoFunc);