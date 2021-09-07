let menu = document.getElementById("menu");
let opList = document.getElementById("opList");
let purchases, sells;
let buttonBTC = document.getElementById("BTC");
let buttonETH = document.getElementById("ETH");
let buttonLTC = document.getElementById("LTC");

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		purchases = jsonFile.purchases;
		//opList.innerHTML = JSON.stringify(jsonFile, undefined, 2);
	})

buttonBTC.addEventListener("click", () => opList.textContent = JSON.stringify(purchases[0], undefined, 2));
buttonETH.addEventListener("click", () => opList.textContent = JSON.stringify(purchases[1], undefined, 2));
buttonLTC.addEventListener("click", () => opList.textContent = JSON.stringify(purchases[2], undefined, 2));