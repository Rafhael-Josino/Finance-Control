/* #################################################################################### */
/* ------------------------- DOM elements and other variables ------------------------- */
/* #################################################################################### */
/* ----------------------------- Page Elements ------------------------- */
const body = document.getElementsByName("body");
const transactionsContainer = document.getElementById("transactionsContainer");
const newTransactionButton = document.getElementById("newTransaction");
const newModal = document.getElementById("newModal");
const editModal = document.getElementById("editModal");

/*--------------------- Form New Transaction --------------------*/
const newDivForm = document.getElementById("newDivForm");
const newForm = document.getElementById("newForm");
const newDescription = document.getElementById("newDescription");
const newValue = document.getElementById("newValue");
const newDate = document.getElementById("newDate");
const newID = document.getElementById("newID");
const formConfirm = document.getElementById("newConfirm");
const formCancel = document.getElementById("newCancel");

/* --------------------- Form Edit Transaction --------------------*/
const editDivForm = document.getElementById("editDivForm");
const editForm = document.getElementById("editForm");
const editDescription = document.getElementById("editDescription");
const editValue = document.getElementById("editValue");
const editDate = document.getElementById("editDate");
const editIndex = document.getElementById("editIndex");
const editFormConfirm = document.getElementById("editFormConfirm");
const editFormCancel = document.getElementById("editFormCancel");
const editFormDelete = document.getElementById("editFormDelete");

/* --------------------- Global Variables -------------------- */
let transactionsLog;
let income = 0;
let expense = 0;
let transactionCounter = 0;
let selectedTransaction;
let currencyUsed = "BRL";


/* #################################################################################### */
/* -------------------------------- Callback functions ---------------------------------*/
/* #################################################################################### */

/* -------------------------- New Transactions Callbacks ---------------------------------*/

// Called when "+ New Transaction" is clicked 
// It readys the form that adds a new transaction
function newTransaction() {
    newDescription.value = null;
    newValue.value = null; 
    newDate.value = null; 
    newID.value = null;

    // This application requires all inputs to be valid
    newDescription.required = true;
    newValue.required = true;
    newDate.required = true;
    
    // Form tab stays apparent
    newModal.classList.remove("sr-only");
}

// Called when the form is submitted
function confirmNewTransaction() {
    // Hidden attributes that servers as ID to each transaction stored
    newID.value = transactionCounter;
    transactionCounter++;
    
    // The amount values is saved as integers to formatations purposes
    newValue.value = Number(newValue.value) * 100;

    const transactionData = {
        "Description": newDescription.value,
        "Value": newValue.value,
        "Date": newDate.value,
        "transactionID": newID.value 
    }
    
    // Adds new transaction data to front-end's list of transactions
    transactionsLog.push(transactionData);
    
    // Updates the page appearance with the new data
    addTransaction(transactionData);
    updateSummaries();
    
    cancelNewTransaction();
}

// Called when form is either submitted or "canceled". It closes the form "windown"
function cancelNewTransaction() {
    /* The fields required are turned false before the browser submits the form
    // This is necessary for browsers like Chrome that trigger erros when the form controls are not focusable
    In this case, the form has its display already setted to "none" when the form is submitted */
    newDescription.required = false;
    newValue.required = false;
    newDate.required = false;
    
    newDate.setAttribute("type", "text");
    newModal.classList.add("sr-only");
}


/* -------------------------------- Edit Transactions Callbacks-------------------------------- */

// Called when a transaction tab is clicked
// It readys the form that edits the respective transaction clicked
function editTransaction(event) {
    // Gets the transaction's current index inside transactionsLog list
    // It does not corresponds necessarily to the transaction's ID
    selectedTransaction = transactionsLog.findIndex(element => element.transactionID === event.currentTarget.id);
    console.log("This ID is:", event.currentTarget.id);
    console.log(transactionsLog[selectedTransaction]);
    
    // The initial form values are the ones from the transaction to be edited
    // This way, the values that shall remain the same don't need to be written again by the user
    editDescription.value = transactionsLog[selectedTransaction].Description;
    editValue.value = Number(transactionsLog[selectedTransaction].Value) / 100;
    editDate.value = transactionsLog[selectedTransaction].Date;

    // This application requires all inputs to be valid
    newDescription.required = true;
    newValue.required = true;
    newDate.required = true;

    // Form tab stays apparent
    editModal.classList.remove("sr-only");
}

// Called when the form is submitted
function confirmEditTransaction() {
	/* The ID atributte remains the same, therefore the hidden input sent in the edit form
	// is the transactions array's index instead of the ID
    With this input's value, the server knows which element to edit */
	editIndex.value = selectedTransaction;

    // The amount values is saved as integers to formatations purposes
    editValue.value = Number(editValue.value) * 100;

    // Updates the transaction data in the front-end's list of transactions
    transactionsLog[selectedTransaction].Description = editDescription.value;
    transactionsLog[selectedTransaction].Value = editValue.value;
    transactionsLog[selectedTransaction].Date = editDate.value;    
	
    // Updates the page appearance with the new data
	const editedDiv = document.getElementById(transactionsLog[selectedTransaction].transactionID);
    const amountClass = editValue.value[0] === '-' ? 'expense' : 'income';
    editedDiv.innerHTML = `
        <span class="description">${editDescription.value}</span>
        <span class="value ${amountClass}">${formatCurrency(editValue.value, amountClass)}</span>
        <span class="date">${editDate.value}</span>
    `;
    updateSummaries();

    cancelEditTransaction();
}

// Called when Delete button present in edit form is clicked
// There is no form submition here, but rather a manual call of a fetch function to the server
function deleteTransaction() {
    // Sends to the server a DELETE request with the transaction's index
    // so the server knows which transaction delete
    fetch("./editTransaction", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            index: selectedTransaction
        })
    }).then(resp => {
        if (resp.status === 204) {
            // If well succeeded
            // Removes the transaction's tab
            transactionsContainer.removeChild(document.getElementById(
				transactionsLog[selectedTransaction].transactionID)); 

            // Updates the transaction data in the front-end's list of transactions
            transactionsLog.splice(selectedTransaction, 1);

            // Update the summay boxes's values
            updateSummaries();
        }
        else console.log("Error at delete transaction nº:", selectedTransaction);
    });

    cancelEditTransaction();
}

// Called when form is either submitted, "canceled" or delete function is called
// It closes the form "windown"
function cancelEditTransaction() {
    // See cancelNewTransaction function for explanation
    newDescription.required = false;
    newValue.required = false;
    newDate.required = false;
    
    editModal.classList.add("sr-only");
    editDate.setAttribute("type", "text");
}


/* ----------------------------- Front-End Appearance ------------------------- */

// Updates the summary boxes (Income, Expenses and Total)
function updateSummaries() {
    income = 0;
    expense = 0;

    transactionsLog.forEach(transaction => {
        if (transaction.Value[0] === '-') expense += Number(transaction.Value);
        else income += Number(transaction.Value);
    });

    document.getElementById("entriesValue").innerHTML = formatCurrency(income);
    document.getElementById("outsValue").innerHTML = formatCurrency(expense)
    document.getElementById("totalValue").innerHTML = formatCurrency(income + expense); 
}

// Adds a new transaction tab
function addTransaction(transactionData) {
    const newTransaction = document.createElement("div");
    newTransaction.classList.add('tableClass', 'tableTransaction');
    newTransaction.setAttribute('id', transactionData.transactionID);
    newTransaction.addEventListener("click", editTransaction);

    const amountClass = transactionData.Value[0] === '-' ? 'expense' : 'income';
    newTransaction.innerHTML = `
        <span class="description">${transactionData.Description}</span>
        <span class="value ${amountClass}">${formatCurrency(transactionData.Value, amountClass)}</span>
        <span class="date">${transactionData.Date}</span>
    `;

    transactionsContainer.appendChild(newTransaction);
}

// Formats the amount value to the currency choosen (up to now fixed to the Brazillian Coin, BRL)
function formatCurrency(_value, _signal) {
    let value = String(_value).replace(/\D/g, "");

    value = Number(value / 100);
    
    const signal = _signal === "expense" ? '-' : '';

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: currencyUsed
    })

    return signal + value;
}


/* #################################################################################### */
/* ------------------------------------- Event Listeners --------------------------------*/
/* #################################################################################### */
newTransactionButton.addEventListener("click", newTransaction);

newForm.addEventListener("submit", confirmNewTransaction);
formCancel.addEventListener("click", cancelNewTransaction);

editForm.addEventListener("submit", confirmEditTransaction);
editFormCancel.addEventListener("click", cancelEditTransaction);
editFormDelete.addEventListener("click", deleteTransaction);


/* #################################################################################### */
/* ------------------------------------- Initialization --------------------------------*/
/* #################################################################################### */

// Fetchs the data from server
fetch('transactionsLog').then(resp => resp.json().then(jsonFile => {
    transactionsLog = jsonFile;

    // Saves the ID value of the next transaction object that can be created
    transactionCounter = Number(transactionsLog[transactionsLog.length - 1].transactionID) + 1;

    // Updates the front-end appearance
    jsonFile.forEach(addTransaction);
    updateSummaries();
    }))
    // Case there is no file yet or other error occours
    .catch(err => {
        console.log('Fail to receive/read file or file does not exist: ', err);
        transactionsLog = [];
});