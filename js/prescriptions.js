let prescriptions = [];
let patients = [];
let doctors = [];
let medicines = [];

let editMode = false;


document.addEventListener("DOMContentLoaded", () => {

    loadPatients();
    loadDoctors();
    loadMedicines();
    loadPrescriptions();

    setTodayDate();

    document
        .getElementById("addPrescriptionBtn")
        .addEventListener("click", openAddModal);

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("prescriptionForm")
        .addEventListener("submit", savePrescription);

    document
        .getElementById("searchInput")
        .addEventListener("input", searchPrescriptions);

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

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

            const select = document.getElementById("patientId");

            select.innerHTML =
                '<option value="">Select Patient</option>';

            patients.forEach(patient => {

                const option = document.createElement("option");

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


/* Load Doctors */

async function loadDoctors() {

    try {

        const response = await fetch(
            "../backend/api/doctors_list.php"
        );

        const result = await response.json();

        if (result.success) {

            doctors = result.data;

            const select = document.getElementById("doctorId");

            select.innerHTML =
                '<option value="">Select Doctor</option>';

            doctors.forEach(doctor => {

                const option = document.createElement("option");

                option.value = doctor.id;

                option.textContent =
                    `${doctor.doctor_code || ""} - Dr. ${doctor.first_name} ${doctor.last_name || ""}`;

                select.appendChild(option);

            });

        }

    } catch (error) {

        console.error(error);
        alert("Failed to load doctors");

    }

}


/* Load Medicines */

async function loadMedicines() {

    try {

        const response = await fetch(
            "../backend/api/medicines_list.php"
        );

        const result = await response.json();

        if (result.success) {

            medicines = result.data;

            const select = document.getElementById("medicineId");

            select.innerHTML =
                '<option value="">Select Medicine</option>';

            medicines.forEach(medicine => {

                const option = document.createElement("option");

                option.value = medicine.id;

                option.textContent =
                    medicine.medicine_name;

                select.appendChild(option);

            });

        }

    } catch (error) {

        console.error(error);
        alert("Failed to load medicines");

    }

}


/* Load Prescriptions */

async function loadPrescriptions() {

    try {

        const response = await fetch(
            "../backend/api/prescriptions_list.php"
        );

        const result = await response.json();

        if (result.success) {

            prescriptions = result.data;

            displayPrescriptions(prescriptions);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);
        alert("Failed to load prescriptions");

    }

}


/* Display */

function displayPrescriptions(data) {

    const tbody =
        document.getElementById("prescriptionTableBody");

    tbody.innerHTML = "";

    data.forEach(prescription => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${prescription.id}</td>

            <td>${prescription.patient_name || "-"}</td>

            <td>${prescription.doctor_name || "-"}</td>

            <td>${prescription.medicine_name || "-"}</td>

            <td>${prescription.dosage || "-"}</td>

            <td>${prescription.frequency || "-"}</td>

            <td>${prescription.duration || "-"}</td>

            <td>${prescription.prescription_date || "-"}</td>

            <td>

                <button
                    class="view-btn"
                    onclick="viewPrescription(${prescription.id})">
                    View
                </button>

                <button
                    class="edit-btn"
                    onclick="editPrescription(${prescription.id})">
                    Edit
                </button>

            </td>
        `;

        tbody.appendChild(row);

    });

}


/* Open Add */

function openAddModal() {

    editMode = false;

    document.getElementById("modalTitle").textContent =
        "Add Prescription";

    document.getElementById("prescriptionForm").reset();

    document.getElementById("prescriptionId").value = "";

    setTodayDate();

    document.getElementById("prescriptionModal").style.display =
        "block";

}


/* Close */

function closeModal() {

    document.getElementById("prescriptionModal").style.display =
        "none";

}


/* Set Today */

function setTodayDate() {

    const today =
        new Date().toISOString().split("T")[0];

    document.getElementById("prescriptionDate").value =
        today;

}


/* Save */

async function savePrescription(event) {

    event.preventDefault();

    const data = {

        id: document.getElementById("prescriptionId").value,

        patient_id: document.getElementById("patientId").value,

        doctor_id: document.getElementById("doctorId").value,

        medicine_id: document.getElementById("medicineId").value,

        dosage: document.getElementById("dosage").value.trim(),

        frequency: document.getElementById("frequency").value.trim(),

        duration: document.getElementById("duration").value.trim(),

        instructions:
            document.getElementById("instructions").value.trim(),

        prescription_date:
            document.getElementById("prescriptionDate").value

    };


    const url = editMode
        ? "../backend/api/prescriptions_update.php"
        : "../backend/api/prescriptions_add.php";


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

            loadPrescriptions();

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

}


/* Edit */

function editPrescription(id) {

    const prescription =
        prescriptions.find(item => item.id == id);

    if (!prescription) return;

    editMode = true;

    document.getElementById("modalTitle").textContent =
        "Edit Prescription";

    document.getElementById("prescriptionId").value =
        prescription.id;

    document.getElementById("patientId").value =
        prescription.patient_id;

    document.getElementById("doctorId").value =
        prescription.doctor_id;

    document.getElementById("medicineId").value =
        prescription.medicine_id;

    document.getElementById("dosage").value =
        prescription.dosage || "";

    document.getElementById("frequency").value =
        prescription.frequency || "";

    document.getElementById("duration").value =
        prescription.duration || "";

    document.getElementById("instructions").value =
        prescription.instructions || "";

    document.getElementById("prescriptionDate").value =
        prescription.prescription_date;

    document.getElementById("prescriptionModal").style.display =
        "block";

}


/* View */

function viewPrescription(id) {

    const prescription =
        prescriptions.find(item => item.id == id);

    if (!prescription) return;

    alert(
        "Patient: " + prescription.patient_name +
        "\nDoctor: " + prescription.doctor_name +
        "\nMedicine: " + prescription.medicine_name +
        "\nDosage: " + prescription.dosage +
        "\nFrequency: " + prescription.frequency +
        "\nDuration: " + prescription.duration +
        "\nInstructions: " + (prescription.instructions || "-") +
        "\nDate: " + prescription.prescription_date
    );

}


/* Search */

function searchPrescriptions() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    const filtered =
        prescriptions.filter(item =>

            (item.patient_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (item.doctor_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (item.medicine_name || "")
                .toLowerCase()
                .includes(search)

        );

    displayPrescriptions(filtered);

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