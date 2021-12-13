let menu = document.getElementById("menu");
let purchasesList = document.getElementById("purchasesList");
let sellingsList = document.getElementById("sellingsList");
let purchases, sellings;
let selectMenu = document.getElementById("selectMenu");
let selectCrypto = document.getElementById("selectCrypto");
let currentSitDiv = document.getElementById("currentSituationDiv");
let cryptoImage = document.getElementById("image");

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		purchases = jsonFile.purchases;
		sellings = jsonFile.sellings;
		console.log(typeof purchases);
		console.log(typeof sellings);
	})

// Compute the current situation of each crypto:
// total, medium price, aquisition price
// total = sum of remanescent quantities of each purchase operation
// medium price = final medium price attribute of each purchase element
// This parameters will be used to do the checksum of the purchases operations with the user's manual control

let test = "this is just a test";

selectMenu.addEventListener("change", (event) => {
	if (event.target.value === "operations") {
		currentSitDiv.innerHTML = null;
	}
	if (event.target.value === "currentSituation") {
		currentSitDiv.innerHTML = test;
	purchasesList.textContent = null;
	sellingsList.textContent = null;
	}
});

// Will be used to substitute the buttons for a select element
function selectCryptoFunc(event) {
	purchasesList.textContent = JSON.stringify(purchases[event.target.value], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[event.target.value], undefined, 2);
	cryptoImage.src="images/" + stringify(event.target.value);
	cryptoImage.alt="Crypto";
}

selectCrypto.addEventListener("change", selectCryptoFunc);