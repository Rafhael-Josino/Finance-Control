const menu = document.getElementById("menu");

const saveSheet = document.getElementById("saveSheet");
const loadSheet = document.getElementById("loadSheet");

const currentSitTab = document.getElementById("currentSituationTab");
const currentSitDiv = document.getElementById("currentSituationDiv");

const purchasesList = document.getElementById("purchasesList");
const sellingsList = document.getElementById("sellingsList");
const selectCrypto = document.getElementById("selectCrypto");
const cryptoImage = document.getElementById("image");
const tablesP = document.getElementById("tablesP");
const tablesS = document.getElementById("tablesS");

// check if can be deleted:
//let purchases, sellings;

// Temporarily the only user
const user = 'rafhael';

function formatCurrency(_value) {
	let	 value = Number(_value).toFixed(2);
    value = value.replace(/\D/g, "");

    value = Number(value / 100);
    
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value;
}

// To verify values without the function
//function formatCurrency(value) {return value}

function formatDate(date) {
	date = new Date(date);
	date.setDate(date.getDate() + 1);
	return date.toLocaleDateString("pt-BR");
}

function currentSitTabConstruction(jsonFile) {
	const cryptosList = jsonFile.cryptoPurchasesList;
	const sellingsTemp = jsonFile.cryptoSellsList;

	const listOfCryptos = [ 'BTC', 'ETH', 'LTC', 'EOS', 'USDT', 'TUSD', 'USDC', 'PAX', 'BUSD', 'LINK', 'MANA', 'SAND' ];

	const cryptoQuantity = listOfCryptos.length; // According to CryptoPurchasesList's number of attributes
	console.log(cryptoQuantity);

	// Cleans all previous content
	currentSitTab.innerHTML = `
	<tr id="firstRoll">
		<td><strong>Name</strong></td>
		<td><strong>Total Quantity</strong></td>
		<td><strong>Medium Price</strong></td>
		<td><strong>Aquisition Cost</strong></td>
	</tr>
	`;
	tablesP.innerHTML = "";
	tablesS.innerHTML = "";

	// For each cryptocoin:
	for (let i = 0; i < cryptoQuantity; i++) {
		let total = 0;
		const purchases = cryptosList[listOfCryptos[i]];
		const sells = sellingsTemp[listOfCryptos[i]];

		for (let j = 0; j < purchases.length; j++) {
			total = total + purchases[j].remainQuant;
		}

		if (total) {
			const newLine = document.createElement("tr");
			newLine.innerHTML = `
				<td>${listOfCryptos[i]}</td>
				<td>${total}</td>
				<td>${formatCurrency(purchases[purchases.length-1].newMediumPrice)}</td>
				<td>${formatCurrency(purchases[purchases.length-1].newMediumPrice * total)}</td>
			`
			newLine.addEventListener("click", cryptoLogConstruct(purchases, sells)); // fix
			newLine.setAttribute("class", "newLineClass");
			currentSitTab.appendChild(newLine);
		}
	}
}

function cryptoLogConstruct(purchases, sells) {
	function cryptoLog() {
		// JSON objects directly printed
		//purchasesList.textContent = JSON.stringify(purchases[cryptoIndex], undefined, 2);
		//sellingsList.textContent = JSON.stringify(sells[cryptoIndex], undefined, 2);

		// Cleans all previous content
		tablesP.innerHTML = "";
		tablesS.innerHTML = "";
		let index = 0;

		purchases.forEach(purchase => {
			tablesP.appendChild(document.createElement("table"));
			tablesP.lastChild.innerHTML = `
			<tr>
				<td>Asset:</td>
				<td>${purchase.asset}</td>
			</tr>

			<tr class="gray-background">
				<td>Date:</td>
				<td>${formatDate(purchase.date)}</td>
			</tr>

			<tr>
				<td>Local:</td>
				<td>${purchase.local}</td>
			</tr>

			<tr class="gray-background">
				<td>Total Bought:</td>
				<td>${purchase.totalBought}</td>
			</tr>

			<tr>
				<td>Purchase Medium Price:</td>
				<td>${formatCurrency(purchase.purchaseMediumPrice)}</td>
			</tr>

			<tr class="gray-background">
				<td>Tax:</td>
				<td>${purchase.tax}</td>
			</tr>

			<tr>
				<td>Remain Quantity:</td>
				<td>${purchase.remainQuant}</td>
			</tr>

			<tr class="gray-background">
				<td>New Medium Price:</td>
				<td>${formatCurrency(purchase.newMediumPrice)}</td>
			</tr>

			<tr>
				<td>Index:</td>
				<td>${index}</td>
			</tr>
			`
			index++;
		});

		index = 0;

		sells.forEach(sell => {
			tablesS.appendChild(document.createElement("table"));
			tablesS.lastChild.innerHTML = `
			<tr>
				<td>Asset:</td>
				<td>${sell.asset}</td>
			</tr>

			<tr class="gray-background">
				<td>Date:</td>
				<td>${formatDate(sell.sellingDate)}</td>
			</tr>

			<tr>
				<td>Local:</td>
				<td>${sell.local}</td>
			</tr>

			<tr class="gray-background">
				<td>Amount Received:</td>
				<td>${formatCurrency(sell.received)}</td>
			</tr>

			<tr>
				<td>Quantity Sold:</td>
				<td>${sell.quantSold}</td>
			</tr>

			<tr class="gray-background">
				<td>Aquisition Amount:</td>
				<td>${formatCurrency(sell.aquisitionValue)}</td>
			</tr>

			<tr>
				<td>Leftover:</td>
				<td>${sell.leftOver}</td>
			</tr>

			<tr class="gray-background">
				<td>Index:</td>
				<td>${index}</td>
			</tr>
			`

			index++;
			
			sell.buyIndexes.forEach(thisSellBuy => {
				tablesS.appendChild(document.createElement("table"));
				tablesS.lastChild.classList.add("subTable");
				tablesS.lastChild.innerHTML = `
				<tr>
					<td>Purchase index:</td>
					<td>${thisSellBuy.index}</td>
				</tr>

				<tr class="gray-background">
					<td>Date:</td>
					<td>${formatDate(thisSellBuy.date)}</td>
				</tr>

				<tr>
					<td>Quantity sold:</td>
					<td>${thisSellBuy.quant}</td>
				</tr>

				<tr class="gray-background">
					<td>Purchase medium price:</td>
					<td>${formatCurrency(thisSellBuy.price)}</td>
				</tr>
				`
			})
		});
	}
	return cryptoLog;
}

loadSheet.addEventListener('change', (event) => {
	fetch(`sheet/${user}/${event.target.value}`).then(resp => resp.json()).then(operationsData => currentSitTabConstruction(operationsData));
});

saveSheet.addEventListener('click', () => {
	fetch(`saveSheet/${user}`, { method: 'POST' }).then(resp => {
		if (resp.status === 201) {
			console.log(`${user}.json written successfully`)
			alert(`${user}.json written successfully`);
			initialization();
		}
	}).catch(error => {
		console.log("Error in callback - save sheet:", error);
		alert(`sheet${loadSheet.value}.json writting failed`);
	})
});

/* ################# Initialization ################# */

function initialization() {
	fetch(`/sheets/${user}`).then(respStream => respStream.json()).then(resp => {
		loadSheet.innerHTML = `
			<option value="" class="option optionTitle">Load Sheet</option>
		`;
		currentSitTab.innerHTML = `
			<tr id="firstRoll">
				<td><strong>Name</strong></td>
				<td><strong>Total Quantity</strong></td>
				<td><strong>Medium Price</strong></td>
				<td><strong>Aquisition Cost</strong></td>
			</tr>
		`;
		tablesP.innerHTML = "";
		tablesS.innerHTML = "";

		resp.forEach(sheetName => {
			const newOption = document.createElement('option');
			newOption.innerHTML = sheetName;
			newOption.value = sheetName;
			loadSheet.appendChild(newOption);
		});
	});	
}

initialization();

