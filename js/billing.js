let bills = [];
let patients = [];

let editMode = false;


document.addEventListener("DOMContentLoaded", () => {

    loadPatients();

    loadBills();

    setTodayDate();


    document
        .getElementById("addBillBtn")
        .addEventListener("click", openAddModal);


    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);


    document
        .getElementById("billForm")
        .addEventListener("submit", saveBill);


    document
        .getElementById("searchInput")
        .addEventListener("input", searchBills);


    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);


    /* Calculate Total */

    const feeInputs = [
        "consultationFee",
        "medicineFee",
        "roomFee",
        "otherFee"
    ];


    feeInputs.forEach(id => {

        document
            .getElementById(id)
            .addEventListener("input", calculateTotal);

    });

});


/* Load Patients */

async function loadPatients() {

    try {

        const response = await fetch(
            "../backend/api/patients_list.php"
        );

        const result = await response.json();


        if (result.success) {

            patients = result.data;

            const select =
                document.getElementById("patientId");


            select.innerHTML =
                '<option value="">Select Patient</option>';


            patients.forEach(patient => {

                const option =
                    document.createElement("option");


                option.value = patient.id;


                option.textContent =
                    `${patient.patient_code || ""} - ${patient.first_name} ${patient.last_name || ""}`;


                select.appendChild(option);

            });

        }

    } catch (error) {

        console.error(error);

        alert("Failed to load patients");

    }

}


/* Load Bills */

async function loadBills() {

    try {

        const response = await fetch(
            "../backend/api/bills_list.php"
        );


        const result = await response.json();


        if (result.success) {

            bills = result.data;

            displayBills(bills);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Failed to load bills");

    }

}


/* Display Bills */

function displayBills(data) {

    const tbody =
        document.getElementById("billTableBody");


    tbody.innerHTML = "";


    data.forEach(bill => {

        let statusClass = "status-pending";


        if (bill.payment_status === "Paid") {

            statusClass = "status-paid";

        } else if (bill.payment_status === "Partial") {

            statusClass = "status-partial";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${bill.id}</td>

            <td>${bill.patient_name || "-"}</td>

            <td>${bill.invoice_number || "-"}</td>

            <td>₹${bill.consultation_fee || "0.00"}</td>

            <td>₹${bill.medicine_fee || "0.00"}</td>

            <td>₹${bill.room_fee || "0.00"}</td>

            <td>₹${bill.other_fee || "0.00"}</td>

            <td><strong>₹${bill.total_amount || "0.00"}</strong></td>

            <td>
                <span class="status ${statusClass}">
                    ${bill.payment_status || "Pending"}
                </span>
            </td>

            <td>${bill.payment_method || "-"}</td>

            <td>${bill.billing_date || "-"}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editBill(${bill.id})">
                    Edit
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
        "Create Bill";


    document.getElementById("billForm").reset();


    document.getElementById("billId").value = "";


    document.getElementById("consultationFee").value = 0;

    document.getElementById("medicineFee").value = 0;

    document.getElementById("roomFee").value = 0;

    document.getElementById("otherFee").value = 0;


    document.getElementById("paymentStatus").value =
        "Pending";


    calculateTotal();

    setTodayDate();


    document.getElementById("billModal").style.display =
        "block";

}


/* Close Modal */

function closeModal() {

    document.getElementById("billModal").style.display =
        "none";

}


/* Set Today */

function setTodayDate() {

    const today =
        new Date().toISOString().split("T")[0];


    document.getElementById("billingDate").value =
        today;

}


/* Calculate Total */

function calculateTotal() {

    const consultation =
        parseFloat(
            document.getElementById("consultationFee").value
        ) || 0;


    const medicine =
        parseFloat(
            document.getElementById("medicineFee").value
        ) || 0;


    const room =
        parseFloat(
            document.getElementById("roomFee").value
        ) || 0;


    const other =
        parseFloat(
            document.getElementById("otherFee").value
        ) || 0;


    const total =
        consultation +
        medicine +
        room +
        other;


    document.getElementById("totalAmount").textContent =
        "₹" + total.toFixed(2);

}


/* Save Bill */

async function saveBill(event) {

    event.preventDefault();


    const consultation =
        parseFloat(
            document.getElementById("consultationFee").value
        ) || 0;


    const medicine =
        parseFloat(
            document.getElementById("medicineFee").value
        ) || 0;


    const room =
        parseFloat(
            document.getElementById("roomFee").value
        ) || 0;


    const other =
        parseFloat(
            document.getElementById("otherFee").value
        ) || 0;


    const total =
        consultation +
        medicine +
        room +
        other;


    const data = {

        id:
            document.getElementById("billId").value,

        patient_id:
            document.getElementById("patientId").value,

        invoice_number:
            document.getElementById("invoiceNumber").value.trim(),

        consultation_fee:
            consultation,

        medicine_fee:
            medicine,

        room_fee:
            room,

        other_fee:
            other,

        total_amount:
            total,

        payment_status:
            document.getElementById("paymentStatus").value,

        payment_method:
            document.getElementById("paymentMethod").value,

        billing_date:
            document.getElementById("billingDate").value

    };


    const url = editMode

        ? "../backend/api/bills_update.php"

        : "../backend/api/bills_add.php";


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

            loadBills();

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

}


/* Edit Bill */

function editBill(id) {

    const bill =
        bills.find(item => item.id == id);


    if (!bill) {

        alert("Bill not found");

        return;

    }


    editMode = true;


    document.getElementById("modalTitle").textContent =
        "Edit Bill";


    document.getElementById("billId").value =
        bill.id;


    document.getElementById("patientId").value =
        bill.patient_id;


    document.getElementById("invoiceNumber").value =
        bill.invoice_number || "";


    document.getElementById("consultationFee").value =
        bill.consultation_fee || 0;


    document.getElementById("medicineFee").value =
        bill.medicine_fee || 0;


    document.getElementById("roomFee").value =
        bill.room_fee || 0;


    document.getElementById("otherFee").value =
        bill.other_fee || 0;


    document.getElementById("paymentStatus").value =
        bill.payment_status || "Pending";


    document.getElementById("paymentMethod").value =
        bill.payment_method || "";


    document.getElementById("billingDate").value =
        bill.billing_date || "";


    calculateTotal();


    document.getElementById("billModal").style.display =
        "block";

}


/* Search */

function searchBills() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const filtered =
        bills.filter(bill =>

            (bill.patient_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (bill.invoice_number || "")
                .toLowerCase()
                .includes(search)

        );


    displayBills(filtered);

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