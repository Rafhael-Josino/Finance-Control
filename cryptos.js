let menu = document.getElementById("menu");
let purchasesList = document.getElementById("purchasesList");
let sellingsList = document.getElementById("sellingsList");
let purchases, sellings;
let select = document.getElementById("select");
let currentSitDiv = document.getElementById("currentSituationDiv");
let buttonBTC = document.getElementById("BTC");
let buttonETH = document.getElementById("ETH");
let buttonLTC = document.getElementById("LTC");
let buttonEOS = document.getElementById("EOS");
let buttonUSDT = document.getElementById("USDT");
let buttonTUSD = document.getElementById("TUSD");
let buttonPAX = document.getElementById("PAX");
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

select.addEventListener("change", (event) => {
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
function selectCrypto(event) {
	purchasesList.textContent = JSON.stringify(purchases[event.target.value], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[event.target.value], undefined, 2);
}

buttonBTC.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[0], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[0], undefined, 2);
	cryptoImage.src="images/bitcoin-icon-22.jpg";
	cryptoImage.alt="bitcoin";
});
buttonETH.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[1], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[1], undefined, 2);
	cryptoImage.src="images/ethereum-icon-28.jpg";
	cryptoImage.alt="ether";
});
buttonLTC.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[2], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[2], undefined, 2);
	cryptoImage.src="images/litecoin-2210.png";
	cryptoImage.alt="litecoin";
});

buttonEOS.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[3], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[3], undefined, 2);
	cryptoImage.src="images/eos-coin-2213.png";
})

buttonUSDT.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[4], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[4], undefined, 2);
	cryptoImage.src="images/tether-coin-2212.png";
})

buttonTUSD.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[5], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[5], undefined, 2);
})

buttonUSDC.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[6], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[6], undefined, 2);
})

buttonPAX.addEventListener("click", () => {
	purchasesList.textContent = JSON.stringify(purchases[7], undefined, 2);
	sellingsList.textContent = JSON.stringify(sellings[7], undefined, 2);
})

