let sortDirections = {};
let selectedRows = []; 
let selectedRowIndex = null; 

// Sample chemical data (15 rows)
const originalData = [
    { id: 1, chemicalName: "Ammonium Persulfate", vendor: "LG Chem", density: "3225.92", viscosity: "90.63", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: "60495.18" },
    { id: 2, chemicalName: "Caustic Potash", vendor: "Formosa", density: "3122.75", viscosity: "85.27", packaging: "Barrel", packSize: "50.00", unit: "L", quantity: "48295.19" },
    { id: 3, chemicalName: "Ferric Nitrate", vendor: "DowDupont", density: "2500.45", viscosity: "88.42", packaging: "Bag", packSize: "25.00", unit: "kg", quantity: "10295.10" },
    { id: 4, chemicalName: "Glycol Ether PM", vendor: "LG Chem", density: "6495.18", viscosity: "72.12", packaging: "Bag", packSize: "200.00", unit: "kg", quantity: "8723.23" },
    { id: 5, chemicalName: "Nitric Acid", vendor: "Formosa", density: "1450.88", viscosity: "58.34", packaging: "Drum", packSize: "10.00", unit: "L", quantity: "5000.00" },
    { id: 6, chemicalName: "Sodium Hydroxide", vendor: "DowDupont", density: "3050.32", viscosity: "67.12", packaging: "Barrel", packSize: "50.00", unit: "kg", quantity: "7500.00" },
    { id: 7, chemicalName: "Sulfuric Acid", vendor: "LG Chem", density: "1825.92", viscosity: "82.63", packaging: "Drum", packSize: "20.00", unit: "L", quantity: "12400.00" },
    { id: 8, chemicalName: "Methanol", vendor: "Formosa", density: "795.18", viscosity: "60.23", packaging: "Barrel", packSize: "100.00", unit: "L", quantity: "3000.00" },
    { id: 9, chemicalName: "Acetic Acid", vendor: "DowDupont", density: "1895.18", viscosity: "52.11", packaging: "Drum", packSize: "20.00", unit: "L", quantity: "8500.00" },
    { id: 10, chemicalName: "Hydrochloric Acid", vendor: "Sinopec", density: "1200.32", viscosity: "72.11", packaging: "Bag", packSize: "200.00", unit: "kg", quantity: "12200.00" },
    { id: 11, chemicalName: "Benzene", vendor: "LG Chem", density: "842.92", viscosity: "45.23", packaging: "Barrel", packSize: "25.00", unit: "L", quantity: "5400.00" },
    { id: 12, chemicalName: "Propylene Glycol", vendor: "Formosa", density: "950.28", viscosity: "55.12", packaging: "Drum", packSize: "200.00", unit: "L", quantity: "10200.00" },
    { id: 13, chemicalName: "Ethylene Glycol", vendor: "DowDupont", density: "1100.32", viscosity: "78.22", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: "5000.00" },
    { id: 14, chemicalName: "Dimethylaminopropylamino", vendor: "LG Chem", density: "1205.18", viscosity: "60.34", packaging: "Barrel", packSize: "50.00", unit: "L", quantity: "8000.00" },
    { id: 15, chemicalName: "Xylene", vendor: "Sinopec", density: "1405.32", viscosity: "70.55", packaging: "Drum", packSize: "200.00", unit: "L", quantity: "7500.00" }
];

let chemicalsData = loadDataFromLocalStorage() || [...originalData];

// Populate the table
function populateTable() {
    const tableBody = document.querySelector('#chemicals-table tbody');
    tableBody.innerHTML = ''; 

    chemicalsData.forEach((chemical, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}" ${selectedRows.includes(index) ? 'checked' : ''}></td>
            <td>${chemical.id}</td>
            <td>${chemical.chemicalName}</span></td>
            <td>${chemical.vendor}</span></td>
            <td><span class="editable" onclick="inlineEdit(this, ${index}, 'density')">${chemical.density}</td>
            <td><span class="editable" onclick="inlineEdit(this, ${index}, 'viscosity')">${chemical.viscosity}</td>
            <td>${chemical.packaging}</span></td>
            <td><span class="editable" onclick="inlineEdit(this, ${index}, 'packSize')">${chemical.packSize}</td>
            <td>${chemical.unit}</td>
            <td><span class="editable" onclick="inlineEdit(this, ${index}, 'quantity')">${chemical.quantity}</span></td>
            <td><button onclick="openEditModal(${index})" class="edit-button"><i class="fa-solid fa-pencil"></i></button></td>
        `;
        tableBody.appendChild(row);

        if (selectedRows.includes(index)) {
            row.style.backgroundColor = 'rgba(100, 100, 255, 0.20)'; 
        } else {
            row.style.backgroundColor = ''; 
        }

    });

    // Reapply the event listeners to track checkbox changes
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const index = parseInt(this.getAttribute('data-index'));
            const row = this.closest('tr');

            if (this.checked) {
                selectedRows.push(index); 
                row.style.backgroundColor = 'rgba(100, 100, 255, 0.20)'; 
            } else {
                selectedRows = selectedRows.filter(i => i !== index); 
                row.style.backgroundColor = ''; 
            }
        });
    });
}

// Function to show the popup notification
function showPopup(message) {
    const popup = document.getElementById('popupNotification');
    popup.innerText = message;
    popup.style.display = 'block';
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 3000); 
}

// Sort the table by a specific column
function sortTable(columnIndex) {
    let rows = Array.from(document.querySelectorAll('#chemicals-table tbody tr'));

    // Toggle sort direction for the selected column
    if (!sortDirections[columnIndex]) {
        sortDirections[columnIndex] = true; 
    } else {
        sortDirections[columnIndex] = !sortDirections[columnIndex]; 
    }

    let ascending = sortDirections[columnIndex];

    // Show the popup notification instead of an alert
    if (ascending) {
        showPopup('Column sorted in ascending order!');
    } else {
        showPopup('Column sorted in descending order!');
    }

    rows.sort((a, b) => {
        let cellA = a.cells[columnIndex].innerText;
        let cellB = b.cells[columnIndex].innerText;

        // Check if we're sorting the "Pack Size" column (index 7)
        if (columnIndex === 7) {
            let valueA = parseFloat(cellA); 
            let valueB = parseFloat(cellB);

            return ascending ? valueA - valueB : valueB - valueA;
        }

        // Check if sorting by numbers (e.g., density or quantity)
        if (!isNaN(cellA) && !isNaN(cellB)) {
            return ascending ? cellA - cellB : cellB - cellA;
        }

        // Otherwise, perform a standard string comparison
        return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    const tbody = document.querySelector('#chemicals-table tbody');
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Refresh the table by restoring the original data
function refreshTable() {
    chemicalsData = [...originalData]; 
    selectedRows = []; 
    populateTable();
}

// Delete selected rows
function deleteSelectedRows() {
    if (selectedRows.length === 0) {
        alert("Please select one or more rows to delete.");
        return;
    }

    selectedRows.sort((a, b) => b - a);

    selectedRows.forEach(index => {
        chemicalsData.splice(index, 1); 
    });
    selectedRows = [];
    populateTable();
}

// Add new row function (opens modal)
function addRow() {
    document.getElementById('rowModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('rowModal').style.display = 'none';
}

// Save new row and populate it in the table
function saveNewRow() {
    const newChemical = {
        id: chemicalsData.length + 1,
        chemicalName: document.getElementById('newChemicalName').value || 'N/A',
        vendor: document.getElementById('newVendor').value || 'N/A',
        density: document.getElementById('newDensity').value || 'N/A',
        viscosity: document.getElementById('newViscosity').value || 'N/A',
        packaging: document.getElementById('newPackaging').value || 'N/A',
        packSize: document.getElementById('newPackSize').value || 'N/A',
        unit: document.getElementById('newUnit').value || 'N/A',
        quantity: document.getElementById('newQuantity').value || 'N/A'
    };

    chemicalsData.push(newChemical);
    closeModal();
    populateTable();
}


// Move selected row up
function moveRowUp() {
    if (selectedRows.length !== 1) {
        alert("Please select exactly one row to move.");
        return;
    }

    const index = selectedRows[0];
    if (index > 0) { 
        [chemicalsData[index - 1], chemicalsData[index]] = [chemicalsData[index], chemicalsData[index - 1]];
        selectedRows = [index - 1]; 
        populateTable();
    } else {
        alert("The row is already at the top.");
    }
}

// Move selected row down
function moveRowDown() {
    if (selectedRows.length !== 1) {
        alert("Please select exactly one row to move.");
        return;
    }

    const index = selectedRows[0];
    if (index < chemicalsData.length - 1) { 
        [chemicalsData[index + 1], chemicalsData[index]] = [chemicalsData[index], chemicalsData[index + 1]]; 
        selectedRows = [index + 1]; 
        populateTable(); 
    } else {
        alert("The row is already at the bottom.");
    }
}

// Open the modal with current data for editing
function openEditModal(index) {
    selectedRowIndex = index;
    const chemical = chemicalsData[index];

    document.getElementById('editChemicalName').value = chemical.chemicalName;
    document.getElementById('editVendor').value = chemical.vendor;
    document.getElementById('editDensity').value = chemical.density;
    document.getElementById('editViscosity').value = chemical.viscosity;
    document.getElementById('editPackaging').value = chemical.packaging;
    document.getElementById('editPackSize').value = chemical.packSize;
    document.getElementById('editUnit').value = chemical.unit;
    document.getElementById('editQuantity').value = chemical.quantity;

    document.getElementById('editModal').style.display = 'block';
}

// Save changes made in the modal
function saveEditedRow() {
    const chemical = chemicalsData[selectedRowIndex];

    chemical.chemicalName = document.getElementById('editChemicalName').value || 'N/A';
    chemical.vendor = document.getElementById('editVendor').value || 'N/A';
    chemical.density = document.getElementById('editDensity').value || 'N/A';
    chemical.viscosity = document.getElementById('editViscosity').value || 'N/A';
    chemical.packaging = document.getElementById('editPackaging').value || 'N/A';
    chemical.packSize = document.getElementById('editPackSize').value || 'N/A';
    chemical.unit = document.getElementById('editUnit').value || 'N/A';
    chemical.quantity = document.getElementById('editQuantity').value || 'N/A';


    document.getElementById('editModal').style.display = 'none';
    populateTable(); 
}

// Close the edit modal without saving changes
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Inline editing for specific fields with blue border when editing
function inlineEdit(element, index, field) {
    const currentValue = element.innerText;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.classList.add('inline-input');

    element.classList.add('editing');

    input.onkeydown = function(e) {
        if (e.key === 'Enter') { 
            input.blur(); 
        }
    };

    input.onblur = function() {
        if (input.value !== currentValue) {
            chemicalsData[index][field] = input.value || currentValue; 
        }
        element.classList.remove('editing'); 
        populateTable(); 
    };

    element.innerHTML = ''; 
    element.appendChild(input); 
    input.focus(); 
}

// Save data to local storage
function saveDataToLocalStorage() {
    localStorage.setItem('chemicalsData', JSON.stringify(chemicalsData));
    alert("Table data has been saved!");
}

// Load data from local storage
function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('chemicalsData');
    return savedData ? JSON.parse(savedData) : null;
}

// Populate table on page load
window.onload = populateTable;


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
