let medicines = [];

let editMode = false;


document.addEventListener("DOMContentLoaded", () => {

    loadMedicines();


    document
        .getElementById("addMedicineBtn")
        .addEventListener("click", openAddModal);


    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);


    document
        .getElementById("medicineForm")
        .addEventListener("submit", saveMedicine);


    document
        .getElementById("searchInput")
        .addEventListener("input", searchMedicines);


    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

});


/* Load Medicines */

async function loadMedicines() {

    try {

        const response = await fetch(
            "../backend/api/medicines_list.php"
        );

        const result = await response.json();


        if (result.success) {

            medicines = result.data;

            displayMedicines(medicines);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Failed to load medicines");

    }

}


/* Display Medicines */

function displayMedicines(data) {

    const tbody =
        document.getElementById("medicineTableBody");


    tbody.innerHTML = "";


    data.forEach(medicine => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${medicine.id}</td>

            <td>${medicine.medicine_name || "-"}</td>

            <td>${medicine.category || "-"}</td>

            <td>${medicine.manufacturer || "-"}</td>

            <td>${medicine.quantity ?? 0}</td>

            <td>₹${medicine.price ?? 0}</td>

            <td>${medicine.expiry_date || "-"}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editMedicine(${medicine.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMedicine(${medicine.id})">
                    Delete
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* Open Add Modal */

function openAddModal() {

    editMode = false;


    document.getElementById("modalTitle").textContent =
        "Add Medicine";


    document.getElementById("medicineForm").reset();


    document.getElementById("medicineId").value = "";


    document.getElementById("quantity").value = 0;

    document.getElementById("price").value = 0;


    document.getElementById("medicineModal").style.display =
        "block";

}


/* Close Modal */

function closeModal() {

    document.getElementById("medicineModal").style.display =
        "none";

}


/* Save Medicine */

async function saveMedicine(event) {

    event.preventDefault();


    const data = {

        id:
            document.getElementById("medicineId").value,

        medicine_name:
            document.getElementById("medicineName").value.trim(),

        category:
            document.getElementById("category").value.trim(),

        manufacturer:
            document.getElementById("manufacturer").value.trim(),

        quantity:
            document.getElementById("quantity").value,

        price:
            document.getElementById("price").value,

        expiry_date:
            document.getElementById("expiryDate").value

    };


    const url = editMode

        ? "../backend/api/medicines_update.php"

        : "../backend/api/medicines_add.php";


    try {

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        alert(result.message);


        if (result.success) {

            closeModal();

            loadMedicines();

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

}


/* Edit Medicine */

function editMedicine(id) {

    const medicine =
        medicines.find(item => item.id == id);


    if (!medicine) {

        alert("Medicine not found");

        return;

    }


    editMode = true;


    document.getElementById("modalTitle").textContent =
        "Edit Medicine";


    document.getElementById("medicineId").value =
        medicine.id;


    document.getElementById("medicineName").value =
        medicine.medicine_name || "";


    document.getElementById("category").value =
        medicine.category || "";


    document.getElementById("manufacturer").value =
        medicine.manufacturer || "";


    document.getElementById("quantity").value =
        medicine.quantity ?? 0;


    document.getElementById("price").value =
        medicine.price ?? 0;


    document.getElementById("expiryDate").value =
        medicine.expiry_date || "";


    document.getElementById("medicineModal").style.display =
        "block";

}


/* Delete Medicine */

async function deleteMedicine(id) {

    const medicine =
        medicines.find(item => item.id == id);


    if (!medicine) {

        alert("Medicine not found");

        return;

    }


    const confirmDelete = confirm(
        `Are you sure you want to delete ${medicine.medicine_name}?`
    );


    if (!confirmDelete) {

        return;

    }


    try {

        const response = await fetch(
            "../backend/api/medicines_delete.php",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id: id
                })

            }
        );


        const result = await response.json();


        alert(result.message);


        if (result.success) {

            loadMedicines();

        }

    } catch (error) {

        console.error(error);

        alert("Failed to delete medicine");

    }

}


/* Search */

function searchMedicines() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const filtered =
        medicines.filter(medicine =>

            (medicine.medicine_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (medicine.category || "")
                .toLowerCase()
                .includes(search)

            ||

            (medicine.manufacturer || "")
                .toLowerCase()
                .includes(search)

        );


    displayMedicines(filtered);

}


/* Logout */

async function logout() {

    try {

        await fetch(
            "../backend/api/logout.php",
            {
                method: "POST"
            }
        );

    } catch (error) {

        console.error(error);

    }


    window.location.href = "../login.html";

}