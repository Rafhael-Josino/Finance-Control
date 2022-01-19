const menu = document.getElementById("menu");
const purchasesList = document.getElementById("purchasesList");
const sellingsList = document.getElementById("sellingsList");
const selectCrypto = document.getElementById("selectCrypto");
const currentSitTab = document.getElementById("currentSituationTab");
const currentSitDiv = document.getElementById("currentSituationDiv");
const cryptoImage = document.getElementById("image");
const tablesP = document.getElementById("tablesP");
const tablesS = document.getElementById("tablesS");
let purchases, sellings;


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

//To verify values without the function
//function formatCurrency(value) {return value}


function formatDate(date) {
	date = new Date(date);
	date.setDate(date.getDate() + 1);
	return date.toLocaleDateString("pt-BR");
}

//To verify values without the function
//function formatDate(date) {return date}

function cryptoLogConstruct(cryptoIndex, purchases, sells) {
	function cryptoLog() {
		// JSON objects directly printed
		//purchasesList.textContent = JSON.stringify(purchases[cryptoIndex], undefined, 2);
		//sellingsList.textContent = JSON.stringify(sells[cryptoIndex], undefined, 2);

		// Cleans all previous content
		tablesP.innerHTML = "";
		tablesS.innerHTML = "";
		let index = 0;

		purchases[cryptoIndex].forEach(purchase => {
			tablesP.appendChild(document.createElement("table"));
			tablesP.lastChild.innerHTML = `
			<tr>
				<td>Asset:</td>
				<td>${purchase.asset}</td>
			</tr>
			<tr>
				<td>Date:</td>
				<td>${formatDate(purchase.date)}</td>
			</tr>
			<tr>
				<td>Local:</td>
				<td>${purchase.local}</td>
			</tr>
			<tr>
				<td>Total Bought:</td>
				<td>${purchase.totalBought}</td>
			</tr>
			<tr>
				<td>Purchase Medium Price:</td>
				<td>${formatCurrency(purchase.purchaseMediumPrice)}</td>
			</tr>
			<tr>
				<td>Tax:</td>
				<td>${purchase.tax}</td>
			</tr>
			<tr>
				<td>Remain Quantity:</td>
				<td>${purchase.remainQuant}</td>
			</tr>
			<tr>
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

		sells[cryptoIndex].forEach(sell => {
			tablesS.appendChild(document.createElement("table"));
			tablesS.lastChild.innerHTML = `
			<tr>
				<td>Asset:</td>
				<td>${sell.asset}</td>
			</tr>
			<tr>
				<td>Date:</td>
				<td>${formatDate(sell.sellingDate)}</td>
			</tr>
			<tr>
				<td>Local:</td>
				<td>${sell.local}</td>
			</tr>
			<tr>
				<td>Amount Received:</td>
				<td>${formatCurrency(sell.received)}</td>
			</tr>
			<tr>
				<td>Quantity Sold:</td>
				<td>${sell.quantSold}</td>
			</tr>
			<tr>
				<td>Aquisition Amount:</td>
				<td>${formatCurrency(sell.aquisitionValue)}</td>
			</tr>
			<tr>
				<td>Leftover:</td>
				<td>${sell.leftOverQuant}</td>
			</tr>
			<tr>
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
				<tr>
					<td>Date:</td>
					<td>${formatDate(thisSellBuy.date)}</td>
				</tr>
				<tr>
					<td>Quantity bought:</td>
					<td>${thisSellBuy.quant}</td>
				</tr>
				<tr>
					<td>Purchase medium price:</td>
					<td>${formatCurrency(thisSellBuy.price)}</td>
				</tr>
				`
			})
		});
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
			newLine.lastChild.innerHTML = formatCurrency(cryptosList[i][cryptosList[i].length-1].newMediumPrice);
			newLine.insertCell(-1);
			newLine.lastChild.innerHTML = formatCurrency(total * cryptosList[i][cryptosList[i].length-1].newMediumPrice);
			newLine.setAttribute("class", "newLineClass");
			newLine.addEventListener("click", cryptoLogConstruct(i, cryptosList, sellingsTemp));
			currentSitTab.appendChild(newLine);
		}
	})