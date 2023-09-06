//  import * as departmentDB from './DepartmentDB.js';
//  import * as itemsDB from './ItemsDB.js';
 import * as departmentDB from './fetch-departments-db.js';
 import { getAllItems, addItem, removeItem } from './fetch-items-db.js';

let itemsabc = [];

fetch('MOCK_DATA.csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.split('\n').slice(1);
    itemsabc = rows.map(row => {
      const fields = row.split(',');
      return {
        barcodeNumber: fields[0],
        id: fields[1],
        productName: fields[2],
        price: fields[3],
        description: fields[4],
        quantity: fields[5],
        firstName: fields[6],
        lastName: fields[7],
        phoneNumber: fields[8],
        purchaseDate: fields[9],
        lastStockDate: fields[10],
        brand: fields[11]
      };
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Define variables
const barcodeInput = document.querySelector(".pos-barcode");
const quantityInput = document.querySelector(".pos-quantity");
const searchButton = document.querySelector(".pos-search");
const tableBody = document.querySelector("table tbody");
const deleteButton = document.querySelector(".pos-delete");
const quantityChangeButton = document.querySelector(".pos-quantity-change");
const priceChangeButton = document.querySelector(".pos-price-change");
const upArrowButtons = document.querySelectorAll(".pos-up-arrow");
const downArrowButtons = document.querySelectorAll(".pos-down-arrow");
const subTotalValue = document.querySelector(".pos-total:nth-of-type(1) .pos-value");
const taxValue = document.querySelector(".pos-total:nth-of-type(2) .pos-value");
const grandTotalValue = document.querySelector(".pos-total:nth-of-type(3) .pos-value");
const payButton = document.querySelector(".pos-pay");
const voidButton = document.querySelector(".pos-button.red:nth-of-type(1)");
const cashButton = document.querySelector("#Cash");
const checkButton = document.querySelector("#Check");
const creditDebitButton = document.querySelector("#Credit");
const accountButton = document.querySelector(".pos-button.green:nth-of-type(4)");
const lookup = document.getElementById("lookup");

lookup.addEventListener("click", async (event) => {
  const page = constructLookUpPage();
  document.body.appendChild(page);
  document.querySelector(".paymentCloseButton").addEventListener("click", (event) => {
    document.body.removeChild(document.querySelector(".TSlookup"));
  });
  // add all departments -- get request
  const grid = document.getElementById("departmentContainer");
  const departments = await departmentDB.getAllDepartments();
  departments.forEach((elem) => {
    const dep = document.createElement("button");
    dep.id = elem;
    dep.innerText = elem;
    dep.classList.add("depGridItem");
    dep.addEventListener("click", async (e) => {
      // construct page
      const depName = elem;
        document.body.removeChild(page);
        const pg = constructItemPage();
        document.body.appendChild(pg);
        document.querySelector(".paymentCloseButton").addEventListener("click", (event) => {
          document.body.removeChild(document.querySelector(".TSlookup"));
        });

        const itemGrid = document.getElementById("itemsContainer");
        const items = await itemsDB.getAllItems(depName);
        items.forEach((i) => {
          const it = document.createElement("button");
          it.classList.add(depName);
          it.price = i.price;
          it.innerText = i.itemInfo + " price: $" + i.price;
          it.identifier = i._id;
          it.classList.add("item");
          it.addEventListener("click", async (e) => {
            // populate table
            populateTable(it);
          })
          itemGrid.appendChild(it);
        });

        document.getElementById("addItem").addEventListener("click", async (event) => {
          const name = document.getElementById("itemName").value;
          const price = Number(document.getElementById("itemPrice").value);
          const items = await itemsDB.addItem({_id: depName, itemInfo: name, price: price});
          document.getElementById("itemsContainer").innerHTML = '';
          items.forEach((elem) => {
            const it = document.createElement("button");
            it.classList.add(depName);
            it.price = elem.price;
            it.innerText = elem.itemInfo + " price: $" + elem.price;
            it.identifier = elem._id;
            it.classList.add("item");
            it.addEventListener("click", (e) => {
              // populate table
              populateTable(it);
            })
            document.getElementById("itemsContainer").appendChild(it);
          });
        })

        document.getElementById("remItem").addEventListener("click", async (event) => {
          const name = document.getElementById("removeItem").value;
          const items = await itemsDB.removeItem({_id: depName, itemInfo: name});
          document.getElementById("itemsContainer").innerHTML = '';
          items.forEach((elem) => {
            const it = document.createElement("button");
            it.classList.add(depName);
            it.price = elem.price;
            it.innerText = elem.itemInfo + " price: $" + elem.price;
            it.identifier = elem._id;
            it.classList.add("item");
            it.addEventListener("click", (e) => {
              // populate table
              populateTable(it);
            })
            document.getElementById("itemsContainer").appendChild(it);
          });
        })


      })
      grid.appendChild(dep);
    })


  // functionality for adding item
  document.getElementById("addDep").addEventListener("click", async (e) => {
    const name = document.getElementById("addDepartment").value;
    const departments = await departmentDB.addDepartments(name);
    const grid = document.getElementById("departmentContainer");
    grid.innerHTML = '';
    departments.forEach((elem) => {
      const dep = document.createElement("button");
      dep.id = elem;
      dep.innerText = elem;
      dep.classList.add("depGridItem");
      dep.addEventListener("click", async (e) => {
        // construct page
        const depName = elem;
        document.body.removeChild(page);
        const pg = constructItemPage();
        document.body.appendChild(pg);
        document.querySelector(".paymentCloseButton").addEventListener("click", (event) => {
          document.body.removeChild(document.querySelector(".TSlookup"));
        });

        const itemGrid = document.getElementById("itemsContainer");
        const items = await itemsDB.getAllItems(depName);
        items.forEach((i) => {
          const it = document.createElement("button");
          it.classList.add(depName);
          it.price = i.price;
          it.innerText = i.itemInfo + " price: $" + i.price;
          it.identifier = i._id;
          it.classList.add("item");
          it.addEventListener("click", (e) => {
            // populate table
            populateTable(it);
          })
          itemGrid.appendChild(it);
        });

        document.getElementById("addItem").addEventListener("click", async (event) => {
          const name = document.getElementById("itemName").value;
          const price = Number(document.getElementById("itemPrice").value);
          const items = await itemsDB.addItem({_id: depName, itemInfo: name, price: price});
          document.getElementById("itemsContainer").innerHTML = '';
          items.forEach((elem) => {
            const it = document.createElement("button");
            it.classList.add(depName);
            it.price = elem.price;
            it.innerText = elem.itemInfo + " price: $" + elem.price;
            it.identifier = elem._id;
            it.classList.add("item");
            it.addEventListener("click", (e) => {
              // populate table
              populateTable(it);
            })
            document.getElementById("itemsContainer").appendChild(it);
          });
        })
        document.getElementById("remItem").addEventListener("click", async (event) => {
          const name = document.getElementById("removeItem").value;
          const items = await itemsDB.removeItem({_id: depName, itemInfo: name});
          document.getElementById("itemsContainer").innerHTML = '';
          items.forEach((elem) => {
            const it = document.createElement("button");
            it.classList.add(depName);
            it.price = elem.price;
            it.innerText = elem.itemInfo + " price: $" + elem.price;
            it.identifier = elem._id;
            it.classList.add("item");
            it.addEventListener("click", (e) => {
              // populate table
              populateTable(it);
            })
            document.getElementById("itemsContainer").appendChild(it);
          });
        })
      })
      grid.appendChild(dep);
    });
  })

  // functionality for removing grid item
  document.getElementById("remDep").addEventListener("click", async (e) => {
    const name = document.getElementById("removeDepartment").value;
    const departments = await departmentDB.removeDepartments(name);
    const grid = document.getElementById("departmentContainer");
    grid.innerHTML = '';
    departments.forEach((elem) => {
      const dep = document.createElement("button");
      dep.id = elem;
      dep.innerText = elem;
      dep.classList.add("depGridItem");
      dep.addEventListener("click", async (e) => {
        // construct page
        const depName = elem;
        document.body.removeChild(page);
        const pg = constructItemPage();
        document.body.appendChild(pg);
        document.querySelector(".paymentCloseButton").addEventListener("click", async (event) => {
          document.body.removeChild(document.querySelector(".TSlookup"));
        });

        const itemGrid = document.getElementById("itemsContainer");
        const items = await itemsDB.getAllItems(depName);
        items.forEach((i) => {
          const it = document.createElement("button");
          it.classList.add(depName);
          it.price = i.price;
          it.innerText = i.itemInfo + " price: $" + i.price;
          it.identifier = i._id;

          it.classList.add("item");
          it.addEventListener("click", (e) => {
            // populate table
            populateTable(it);
          })
          itemGrid.appendChild(it);
        });

        document.getElementById("addItem").addEventListener("click", async (event) => {
          const name = document.getElementById("itemName").value;
          const price = Number(document.getElementById("itemPrice").value);
          const items = await itemsDB.addItem({_id: depName, itemInfo: name, price: price});
          document.getElementById("itemsContainer").innerHTML = '';
          items.forEach((elem) => {
            const it = document.createElement("button");
            it.classList.add(depName);
            it.price = elem.price;
            it.innerText = elem.itemInfo + " price: $" + elem.price;
            it.identifier = elem._id;

            it.classList.add("item");
            it.addEventListener("click", async (e) => {
              // populate table
              populateTable(it);
            })
            document.getElementById("itemsContainer").appendChild(it);
          });
        })
        document.getElementById("remItem").addEventListener("click", async (event) => {
          const name = document.getElementById("removeItem").value;
          const items = await itemsDB.removeItem({_id: depName, itemInfo: name});
          document.getElementById("itemsContainer").innerHTML = '';
          items.forEach((elem) => {
            const it = document.createElement("button");
            it.classList.add(depName);
            it.price = elem.price;
            it.identifier = elem._id;
            it.innerText = elem.itemInfo + " price: $" + elem.price;
            it.classList.add("item");
            it.addEventListener("click", async (e) => {
              // populate table
              populateTable(it);
            })
            document.getElementById("itemsContainer").appendChild(it);
          });
        })
      })
      grid.appendChild(dep);
    });
  })
})

function populateTable(element) {
  let existsInTable = false;
  let row = null;
  const itemInfo = element.innerText.split("price")[0].substring(0, element.innerText.split("price")[0].length - 1);
  for (let child of document.getElementById("tbody").children) {
    if (child.children[1].innerText === itemInfo) {
      existsInTable = true;
      row = child;
      break;
    }
  }
  if (existsInTable) {
    row.children[2].innerText = Number(row.children[2].innerText) + 1 + "";
  }
  else {
    const tableEntry = document.createElement("tr");
    const id = element.identifier;
    const itemPrice = element.innerText.split("price: ")[1].substring(1);
    let html = `<td> ${id}</td> <td>${itemInfo}</td> <td>${1}</td> <td>${itemPrice}</td>`;
    tableEntry.innerHTML = html;
    document.getElementById("tbody").appendChild(tableEntry);
  }
  document.getElementById("Sub").innerText = `$${Number(document.getElementById("grandTotal").innerText.substring(1)) + Number(element.price)}`;
  document.getElementById("grandTotal").innerText = `$${Number(document.getElementById("grandTotal").innerText.substring(1)) + Number(element.price)}`;
}


payButton.addEventListener("click", (event) => {
  const paymentWindow = constructPaymentWindow();
  document.body.appendChild(paymentWindow);
  addListenersToButtons();
});
creditDebitButton.addEventListener("click", (event) => {
  const page = constructPaymentPage("Credit/Debit");
  document.body.appendChild(page);
  addListenersToButtons();
})
cashButton.addEventListener("click", (event) => {
  const page = constructPaymentPage("Cash");
  document.body.appendChild(page);
  addListenersToButtons();
})

checkButton.addEventListener("click", (event) => {
  const page = constructPaymentPage("Cash");
  document.body.appendChild(page);
  addListenersToButtons();
})

searchButton.addEventListener("click", (event) => {
  constructSearchPage();
})

function constructSearchPage() {
  document.body.innerHTML = '';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search for data...';

  const searchButton = document.createElement('button');
  searchButton.textContent = 'Search';
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const matchingData = itemsabc.filter((data) => {
      return (
        (data.productName && data.productName.toLowerCase().includes(searchTerm)) ||
        (data.description && data.description.toLowerCase().includes(searchTerm)) ||
        (data.brand && data.brand.toLowerCase().includes(searchTerm))
      );
    });

    if (matchingData.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No matching data found.';
      document.body.appendChild(noResultsMessage);
      return;
    }

    const resultsTable = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headerColumns = ['Barcode Number', 'Product name', 'Price', 'Description','Additonal Description', 'Quantity', 'First Name', 'Last Name', 'Phone number(Cust)', 'Purchase Date', 'Last Stock Date', 'Brand'];
    headerColumns.forEach((column) => {
      const headerColumn = document.createElement('th');
      headerColumn.textContent = column;
      headerRow.appendChild(headerColumn);
    });
    resultsTable.appendChild(headerRow);
    matchingData.forEach((data) => {
      const dataRow = document.createElement('tr');

      const barcodeColumn = document.createElement('td');
      barcodeColumn.textContent = data.barcodeNumber;
      dataRow.appendChild(barcodeColumn);

      const nameColumn = document.createElement('td');
      nameColumn.textContent = data.productName;
      dataRow.appendChild(nameColumn);

      const priceColumn = document.createElement('td');
      priceColumn.textContent = data.price;
      dataRow.appendChild(priceColumn);

      const descriptionColumn = document.createElement('td');
      descriptionColumn.textContent = data.description;
      dataRow.appendChild(descriptionColumn);

      const quantityColumn = document.createElement('td');
      quantityColumn.textContent = data.quantity;
      dataRow.appendChild(quantityColumn);

      const firstNameColumn = document.createElement('td');
      firstNameColumn.textContent = data.firstName;
      dataRow.appendChild(firstNameColumn);

      const lastNameColumn = document.createElement('td');
      lastNameColumn.textContent = data.lastName;
      dataRow.appendChild(lastNameColumn);

      const phoneColumn = document.createElement('td');
      phoneColumn.textContent = data.phoneNumber;
      dataRow.appendChild(phoneColumn);

      const purchaseDateColumn = document.createElement('td');
      purchaseDateColumn.textContent = data.purchaseDate;
      dataRow.appendChild(purchaseDateColumn);

      const lastStockDateColumn = document.createElement('td');
      lastStockDateColumn.textContent = data.lastStockDate;
      dataRow.appendChild(lastStockDateColumn);

      const brandColumn = document.createElement('td');
      brandColumn.textContent = data.brand;
      dataRow.appendChild(brandColumn);

      resultsTable.appendChild(dataRow);
    });
    document.body.appendChild(resultsTable);
  });
  document.body.appendChild(searchInput);
  document.body.appendChild(searchButton);
}


// function used to add event listeners for all buttons on payment page
function addListenersToButtons() {
  const listCents = document.querySelectorAll(".centContainer");
    listCents.forEach(e => {
      e.addEventListener("click", () => {
        if (e.style.backgroundColor === "white") {
          e.style.backgroundColor = "#532b2b";
        }
        else {
          e.style.backgroundColor = "white";
        }
      });
    })
    const dollarCents = document.querySelectorAll(".dollarButton");
    dollarCents.forEach(e => {
      e.addEventListener("click", () => {
        if (e.style.backgroundColor === "white") {
          e.style.backgroundColor = "#532b2b";
        }
        else {
          e.style.backgroundColor = "white";
        }
      });
    })
    if (document.getElementById("deduct")) {
    document.getElementById("deduct").addEventListener("click", (event) => {
      const dollarCents = document.querySelectorAll(".dollarButton");
      const listCents = document.querySelectorAll(".centContainer");
      let amount = 0;
      dollarCents.forEach(e => {if (e.style.backgroundColor === "white") {
        amount = Number(e.innerText.substring(1));
      }});
      listCents.forEach(e => {if (e.style.backgroundColor === "white") {
        amount = Number("." + e.innerText.substring(0, e.innerText.length - 1));
      }});
      let quantity = Number(document.querySelector(".cashQuantity").value);
      document.querySelector(".cashQuantity").value = 0;
      let total = quantity * amount;
      let curValue = Number(document.getElementById("cashRemaining").value.substring(1));
      document.getElementById("cashRemaining").value = "$" + (curValue - total);
      dollarCents.forEach(e => {e.style.backgroundColor = "#532b2b";});
      listCents.forEach(e => {e.style.backgroundColor = "#532b2b";});
    })
  }
    if (document.querySelector(".confirmCash")) {
      document.querySelector(".confirmCash").addEventListener("click", (event) => {
        document.body.removeChild(document.querySelector(".paymentPageContainer"));
        document.getElementById("grandTotal").innerText = "$0.00";
        document.getElementById("Tax").innerText = "$0.00";
        document.getElementById("Sub").innerText = "$0.00";
      })
  }
}

// function used to dynamically construct payment page after clicking on Pay Button
function constructPaymentWindow() {
  const paymentCont= document.createElement("div");
  const div = document.createElement("div");

  const close = document.createElement("button");
  close.innerText = "\u274C";
  close.setAttribute("type", "button");
  close.classList.add("paymentCloseButton");
  close.addEventListener("click", (event) => {
    document.body.removeChild(paymentCont);
  });

  paymentCont.appendChild(close);
  paymentCont.appendChild(div);
  div.id = "payButtonContainer";
  paymentCont.id = "paymentCont";
  const select = document.createElement("select"), label = document.createElement("label");
  select.id = "paymentDropDown";
  label.setAttribute("for", "paymentDropDown");
  label.innerText = "Choose a Payment Method: ";
  div.appendChild(label);
  const names = ['Credit/Debit', 'Cash', 'Check'];
  const options = new Array(3).fill(null).map((e, i) => {let o = document.createElement("option");
    o.classList.add("payOption");
    o.value = o.innerText = names[i];
    return o;
  });
  options.forEach(o => select.appendChild(o));
  div.appendChild(select);
  const next = document.createElement("input");
  next.value = "Proceed to Purchase";
  next.type = "button";
  next.id = "proceed";
  div.appendChild(next);

  next.addEventListener("click", (e) => {
    const page = constructPaymentPage(document.getElementById("paymentDropDown").value);
    document.body.removeChild(paymentCont);
    document.body.appendChild(page);
    addListenersToButtons();
  });

  return paymentCont;
}

// function used to dynamically construct TSLOOK Up page to find items by name
function constructLookUpPage() {
  const container = document.createElement("div");
  container.classList.add("TSlookup");
  const close = document.createElement("button");
  close.innerText = "\u274C";
  close.setAttribute("type", "button");
  close.classList.add("paymentCloseButton");
  container.appendChild(close);

  let html = "<div class=crudTS><div class=TSCrudAdd> <button type=button class=tsButton id=addDep> Add Department </button>";
  html += "<input id=addDepartment type=text></div>";
  html += "<div class=TSCrudRemove> <button type=button class=tsButton id=remDep> Remove Department </button>";
  html += "<input id=removeDepartment type=text></div>";
  html += "<div id=departments></div> </div>";
  html += "<div id=departmentContainer></div>";
  container.innerHTML += html;
  return container;
}

function constructItemPage() {
  const container = document.createElement("div");
  container.classList.add("TSlookup");
  const close = document.createElement("button");
  close.innerText = "\u274C";
  close.setAttribute("type", "button");
  close.classList.add("paymentCloseButton");
  container.appendChild(close);

  let html = "<div class=crudTSItem><div class=TSCrudAddItem> <button type=button id=addItem> Add Item </button>";
  html += "<input id=itemName type=text placeholder=Item\xa0name> <input placeholder=Item\xa0price id=itemPrice type=number></div>";
  html += "<div class=TSCrudItemRemove> <button type=button id=remItem> Remove Item </button>";
  html += "<input id=removeItem placeholder=Item\xa0name type=text></div>";
  html += "<div id=items></div> </div>";
  html += "<div id=itemsContainer></div>";
  container.innerHTML += html;
  return container;
}

// function used to dynamically construct payment page after clicking on either cash, check, or debit buttons
function constructPaymentPage(type) {
  const container = document.createElement("div");
  container.classList.add("paymentPageContainer");
  const close = document.createElement("button");
  close.innerText = "\u274C";
  close.setAttribute("type", "button");
  close.classList.add("paymentCloseButton");
  close.addEventListener("click", (event) => {
    document.body.removeChild(container);
  });
  container.appendChild(close);
  if (type === "Credit/Debit") {
    const form = document.createElement("form");
    form.classList.add("paymentCredentials");
    form.appendChild(document.createElement("div"));
    form.firstChild.innerText = "Enter Your Payment Details";
    form.firstChild.classList.add("paymentInstruction");
    const credit = document.createElement("input"), addr = document.createElement("input"), country = document.createElement("select"), 
    city = document.createElement("input"), state = document.createElement("select"), zip = document.createElement("input");
    credit.classList.add("creditNumber");
    addr.classList.add("address");
    country.classList.add("country");
    city.classList.add("city");
    state.classList.add("state");
    zip.classList.add("zip");

    credit.placeholder = "\u{1F4B3} Card number";
    addr.placeholder = "Street address";
    city.placeholder = "city";
    zip.placeholder = "zip";
    const option = document.createElement("option"), optionState = document.createElement("option");
    option.value = "United States";
    option.innerText = option.value;
    optionState.value = "MA";
    optionState.innerText = optionState.value;
    country.appendChild(option);
    state.appendChild(optionState);
    const cont = document.createElement("div");
    cont.classList.add("credentials");
    const total = document.createElement("div"), text = document.createElement("div"), cost = document.createElement("div");
    total.classList.add("totalCost");
    total.appendChild(text);
    total.appendChild(cost);
    text.innerText = "Total";
    cost.id = "text";
    cost.innerText = document.getElementById("grandTotal").innerText;
    
    cont.appendChild(total);
    cont.appendChild(document.createElement("hr"));
    cont.appendChild(document.createElement("br"));
    cont.appendChild(credit);
    cont.appendChild(addr);
    cont.appendChild(country);
    cont.appendChild(city);
    cont.appendChild(state);
    cont.appendChild(zip);
    form.appendChild(cont);
    container.appendChild(form);
    const pay = document.createElement("button");
    pay.innerText = "Pay";
    pay.value = "button";
    pay.setAttribute("type", "button");
    pay.classList.add("payment");
    form.appendChild(pay);
    pay.addEventListener("click", (event) => {
      // post request to database
      const reg = /[0-9]{8}/;
      if (document.querySelector(".creditNumber").value.match(reg) != null) {
        document.body.removeChild(document.querySelector(".paymentPageContainer"));
        document.getElementById("grandTotal").innerText = "$0.00";
        document.getElementById("Tax").innerText = "$0.00";
        document.getElementById("Sub").innerText = "$0.00";
      }
      else {
        alert("Card number is invalid");
      }
    })
  }
  else if(type === "Cash") {
    // 
    const newElem = document.createElement("div");
    newElem.classList.add('cashOwed');
    let str = "<div class=cashContainer><label for=cashRemaining> Amount Owed</label><input value=$" + Number(document.getElementById("grandTotal").innerText.substring(1)) + " readonly id=cashRemaining></div>";
    newElem.innerHTML += str;
    const elem2 = document.createElement("div");
    elem2.classList.add('cashButtonsContainer');
    let html = "<div class=dollarContainer> <button class=dollarButton> $1</button><button class=dollarButton>$5</button> <button class=dollarButton>$10</button><button class=dollarButton>$20 </button><button class=dollarButton>$50</button> <button class=dollarButton>$100</button></div>";
    html += "<div class=cent> <button class=centContainer>1\u00A2</button> <button class=centContainer>5\u00A2</button><button class=centContainer>10\u00A2</button><button class=centContainer>25\u00A2</button> </div> </div>";
    elem2.innerHTML += html;
    container.appendChild(newElem);
    container.appendChild(elem2);

    const containerQuantity = document.createElement("div");
    containerQuantity.classList.add("quanContainer");
    const cont = document.createElement("div");
    cont.classList.add("quantityContainer");
    const lab = document.createElement("label");
    lab.classList.add("quantLabel");
    lab.innerText = "Quantity: ";
    cont.appendChild(lab);
    const elem3 = document.createElement("input");
    elem3.setAttribute("type", "number");
    elem3.classList.add("cashQuantity");
    elem3.placeholder = 0;
    cont.appendChild(elem3);
    containerQuantity.appendChild(cont);
    container.appendChild(containerQuantity);

    const deductFromCost = document.createElement("div");
    deductFromCost.classList.add("deduct");
    const deductButton = document.createElement("button");
    deductButton.id = "deduct";
    deductButton.setAttribute("type", "button");
    deductButton.classList.add("deductButton");
    deductButton.innerText = "Deduct From Cost";
    deductFromCost.appendChild(deductButton);
    container.appendChild(deductFromCost);
    
    const confirm = document.createElement("button");
    confirm.classList.add("confirmCash");
    confirm.innerText = "Confirm";
    container.appendChild(confirm);
  }
  return container;
}

let items = [];
let scannedItems = [];

quantityInput.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    addItemFunc();
  }
});
deleteButton.addEventListener("click", deleteItem);
quantityChangeButton.addEventListener("click", changeQuantity);
priceChangeButton.addEventListener("click", changePrice);
// payButton.addEventListener("click", processPayment);
voidButton.addEventListener("click", voidInvoice);

function addItemFunc() {
  // Get the barcode and quantity from the input fields
  const barcode = barcodeInput.value.trim();
  const quantity = quantityInput.value.trim();

  // Check if the barcode is already in the items array
  const item = items.find((item) => item.barcode === barcode);

  if (name && price) {
    const newItem = { barcode, name, price };
    items.push(newItem);
    const scannedItem = { ...newItem, quantity };
    scannedItems.push(scannedItem);
    updateTable();
  }
}

function updateTable() {
// Clear the table body
tableBody.innerHTML = "";

// Loop through the scanned items and add them to the table
scannedItems.forEach((item) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${item.barcode}</td>
    <td>${item.name}</td>
    <td>${item.quantity}</td>
    <td>$${item.price * item.quantity}</td>
  `;
  tableBody.appendChild(row);
});

// Update the totals
const subTotal = scannedItems.reduce((total, item) => total + item.price * item.quantity, 0);
const tax = subTotal * 0.1;
const grandTotal = subTotal + tax;
subTotalValue.textContent = `$${subTotal.toFixed(2)}`;
taxValue.textContent = `$${tax.toFixed(2)}`;
grandTotalValue.textContent = `$${grandTotal.toFixed(2)}`;
}

function deleteItem() {
// Remove the last scanned item from the array and update the table
scannedItems.pop();
updateTable();
}

function changeQuantity() {
// Loop through the scanned items and update their quantity based on the arrow button clicked
  if (this.querySelector(".pos-up-arrow").contains(event.target)) {
    scannedItems.forEach((item) => {
      if (item.barcode === scannedItems[scannedItems.length - 1].barcode) {
        item.quantity++;
      }
    });
  } else if (this.querySelector(".pos-down-arrow").contains(event.target)) {
    scannedItems.forEach((item) => {
      if (item.barcode === scannedItems[scannedItems.length - 1].barcode) {
        item.quantity--;
        if (item.quantity < 1) {
          scannedItems.pop();
        }
      }
    });
  }
  updateTable();
}

function changePrice() {
  // Prompt the user to enter a new price and update the scanned item's price
  const newPrice = prompt("Enter new price:");
  scannedItems.forEach((item) => {
    if (item.barcode === scannedItems[scannedItems.length - 1].barcode) {
      item.price = newPrice;
    }
  });
  updateTable();
}

function processPayment(paymentType) {
  // Calculate the change and display it to the user
  const payment = prompt(`Enter ${paymentType} payment amount:`);
  const change = payment - grandTotalValue.textContent.substring(1);
  alert(`Change due: $${change.toFixed(2)}`);
  // Reset the scanned items array and update the table
  scannedItems = [];
  updateTable();
}

function voidInvoice() {
  // Clear the scanned items array and update the table
  scannedItems = [];
  updateTable();
} 