let menu = document.getElementById("menu");
let purchasesList = document.getElementById("purchasesList");
let sellingsList = document.getElementById("sellingsList");
let purchases, sellings;
let buttonBTC = document.getElementById("BTC");
let buttonETH = document.getElementById("ETH");
let buttonLTC = document.getElementById("LTC");
let cryptoImage = document.getElementById("image");

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		purchases = jsonFile.purchases;
		sellings = jsonFile.sellings;
		console.log(typeof purchases);
		console.log(typeof sellings);
		//opList.innerHTML = JSON.stringify(jsonFile, undefined, 2);
	})

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
	cryptoImage.src="images/litecoin-icon-579718.png";
	cryptoImage.alt="litecoin";
});

