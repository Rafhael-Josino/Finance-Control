/* #################################################################################### */
/* ------------------------- DOM elements and other variables ------------------------- */
/* #################################################################################### */
/* ----------------------------- Page Elements ------------------------- */
const body = document.getElementsByName("body");
const transactionsContainer = document.getElementById("transactionsContainer");
const newTransactionButton = document.getElementById("newTransaction");

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
let entries = 0;
let outs = 0;
let transactionCounter = 0;
let selectedTransaction;

/* #################################################################################### */
/* -------------------------------- Callback functions ---------------------------------*/
/* #################################################################################### */

/* -------------------------- New Transactions Callbacks ---------------------------------*/
function newTransaction() {
    newDescription.value = null;
    newValue.value = null; 
    newDate.value = null; 
    newID.value = null;

    newDescription.required = true;
    newValue.required = true;
    newDate.required = true;
    
    newTransactionButton.removeEventListener("click", newTransaction);
    newDivForm.style.display = "block";
    //Obs: It will have to deactivate all the others event listeners
    //Obs2: Or just open a pop-up that will deactive the rest of the page behind the new window
}

function confirmNewTransaction() {
    newID.value = transactionCounter;

    let transactionData = {
        "Description": newDescription.value,
        "Value": newValue.value,
        "Date": newDate.value,
        "transactionID": newID.value 
    }

    console.log("Adding transaction");
    addTransaction(transactionData);
    transactionsLog.push(transactionData);
    transactionCounter++;
    updateSummaries();
    cancelNewTransaction();

    console.log(transactionsLog); //Only for test purposes
}

function cancelNewTransaction() {
    // The fields required are turned false before the browser submits the form
    // This is necessary for browsers like Chrome that trigger erros when the form controls are not focusable
    // In this case, the form has its display already setted to "none" when the form is submitted
    newDescription.required = false;
    newValue.required = false;
    newDate.required = false;
    
    newDate.setAttribute("type", "text");
    newTransactionButton.addEventListener("click", newTransaction);
    newDivForm.style.display = "none";
}

/* -------------------------------- Edit Transactions Callbacks-------------------------------- */
function editTransaction(event) {
    editDescription.value = null;
    editValue.value = null;
    editDate.value = null;
	editIndex.value = null;

    selectedTransaction = transactionsLog.findIndex(element => element.transactionID === event.currentTarget.id);
    console.log("This ID is:", event.currentTarget.id);
    console.log(transactionsLog[selectedTransaction]);
    
    editDescription.value = transactionsLog[selectedTransaction].Description;
    editValue.value = transactionsLog[selectedTransaction].Value;
    editDate.value = transactionsLog[selectedTransaction].Date;

    editDivForm.style.display = "block";
    //Obs: figure out how to move form to below the target element
}

function confirmEditTransaction() {
	// The ID atributte is constant, therefore the hidden input sent in the edit form
	// is the transactions array's index instead, so the server knows which element to edit
	editIndex.value = selectedTransaction;
	
	const editedDiv = document.getElementById(
		transactionsLog[selectedTransaction].transactionID);
	console.log("Children:\n", editedDiv.childNodes);
    editedDiv.childNodes[0].innerHTML = editDescription.value;
    editedDiv.childNodes[1].innerHTML = 'R$ ' + editValue.value;
    editedDiv.childNodes[2].innerHTML = editDate.value;

    transactionsLog[selectedTransaction].Description = editDescription.value;
    transactionsLog[selectedTransaction].Value = editValue.value;
    transactionsLog[selectedTransaction].Date = editDate.value;

    cancelEditTransaction();
}

function deleteTransaction() {
    fetch("./editTransaction", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            index: selectedTransaction
        })
    }).then(resp => {
        if (resp.status === 204) { 
            console.log("Removing in the front-end")
            transactionsContainer.removeChild(document.getElementById(
				transactionsLog[selectedTransaction].transactionID)); 
            transactionsLog.splice(selectedTransaction, 1);
        }
        else console.log("Error at delete transaction nº:", selectedTransaction);
    })
    cancelEditTransaction();
}

function cancelEditTransaction() {
    // See cancelNewTransaction function for explanation
    newDescription.required = false;
    newValue.required = false;
    newDate.required = false;
    
    editDate.setAttribute("type", "text");
    editDivForm.style.display = "none";
}

/* ----------------------------- Front-End Appearance ------------------------- */
function updateSummaries() {
    document.getElementById("entriesValue").innerHTML = 'R$ ' + String(entries); 
    document.getElementById("outsValue").innerHTML = 'R$ ' + String(outs); 
    document.getElementById("totalValue").innerHTML = 'R$ ' + String(entries + outs); 
}

function addTransaction(transactionData) {
    const newTransaction = document.createElement("div");
    newTransaction.classList.add('tableClass', 'tableTransaction');
    newTransaction.setAttribute('id', transactionData.transactionID);
    newTransaction.addEventListener("click", editTransaction);

    let spanArray = [];
    for (let i = 0; i < 4; i++) {
        spanArray.push(document.createElement("span"));
        newTransaction.appendChild(spanArray[i]);
    }
    spanArray[0].setAttribute("class", "description");
    spanArray[1].setAttribute("class", "value");
    spanArray[2].setAttribute("class", "date");
    spanArray[3].setAttribute("class", "symbol");
    spanArray[0].innerHTML = transactionData.Description;
    spanArray[1].innerHTML = 'R$ ' + transactionData.Value;
    spanArray[2].innerHTML = transactionData.Date;

    if (transactionData.Value[0] === '-') {
        spanArray[1].style.color = 'red';
        outs += Number(transactionData.Value);
    }
    else {
        spanArray[1].style.color = 'green';
        entries += Number(transactionData.Value);
    }

    transactionsContainer.appendChild(newTransaction);
}


/* #################################################################################### */
/* ------------------------------------- Event handlers --------------------------------*/
/* #################################################################################### */
newTransactionButton.addEventListener("click", newTransaction);

//formConfirm.addEventListener("click", confirmNewTransaction);
newForm.addEventListener("submit", confirmNewTransaction);
formCancel.addEventListener("click", cancelNewTransaction);

editForm.addEventListener("submit", confirmEditTransaction);
editFormCancel.addEventListener("click", cancelEditTransaction);
editFormDelete.addEventListener("click", deleteTransaction);


/* #################################################################################### */
/* ------------------------------------- Initialization --------------------------------*/
/* #################################################################################### */
fetch('transactionsLog').then(resp => resp.json().then(jsonFile => {
    transactionsLog = jsonFile;

    // Saves the ID value to the next transaction object that can be created
    transactionCounter = Number(transactionsLog[transactionsLog.length - 1].transactionID) + 1;

    jsonFile.forEach(transactionData => addTransaction(transactionData));
    updateSummaries();
})).catch(err => {
    console.log('Fail to receive file or file does not exist: ', err);
    transactionsLog = [];
});