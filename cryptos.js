let menu = document.getElementById("menu");
let opList = document.getElementById("opList");
let allOps;
let buttonBTC = document.getElementById("BTC");
let buttonETH = document.getElementById("ETH");
let buttonLTC = document.getElementById("LTC");

fetch('operations').then(resp => resp.json()).
	then(jsonFile => {
		allOps = jsonFile;
		//opList.innerHTML = JSON.stringify(jsonFile, undefined, 2);
	})

buttonBTC.addEventListener("click", () => opList = opList.innerHTML = JSON.stringify(allOps[0], undefined, 2));

