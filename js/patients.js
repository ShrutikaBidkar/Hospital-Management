let patients = [];

document.addEventListener("DOMContentLoaded", function () {
    loadPatients();
});


/* =========================
   LOAD PATIENTS
========================= */

function loadPatients() {

    const tableBody = document.getElementById("patientTableBody");

    if (!tableBody) {
        console.error("patientTableBody not found");
        return;
    }

    fetch("../backend/api/patients_list.php")

        .then(response => response.json())

        .then(data => {

            console.log("API DATA:", data);

            if (!data.success) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" style="text-align:center;color:red;">
                            ${data.message || "Unable to load patients"}
                        </td>
                    </tr>
                `;

                return;
            }

            patients = data.data || [];

            displayPatients(patients);

        })

        .catch(error => {

            console.error("Patient Error:", error);

            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center;color:red;">
                        Failed to load patients
                    </td>
                </tr>
            `;
        });
}


/* =========================
   DISPLAY PATIENTS
========================= */

function displayPatients(list) {

    const tableBody = document.getElementById("patientTableBody");

    if (!tableBody) {
        console.error("patientTableBody not found");
        return;
    }

    tableBody.innerHTML = "";

    if (!list || list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No patients found
                </td>
            </tr>
        `;

        return;
    }

    list.forEach(patient => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${patient.id}</td>

            <td>${patient.patient_code}</td>

            <td>
                ${patient.first_name || ""}
                ${patient.last_name || ""}
            </td>

            <td>${patient.gender || "-"}</td>

            <td>${patient.date_of_birth || "-"}</td>

            <td>${patient.phone || "-"}</td>

            <td>${patient.email || "-"}</td>

            <td>${patient.blood_group || "-"}</td>

            <td>

                <button
                    class="edit-btn"
                    type="button"
                    onclick="editPatient(${patient.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deletePatient(${patient.id})">
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });
}


/* =========================
   SEARCH PATIENTS
========================= */

function searchPatients() {

    const searchInput = document.getElementById("searchPatient");

    if (!searchInput) {
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredPatients = patients.filter(patient => {

        const patientData = `
            ${patient.patient_code || ""}
            ${patient.first_name || ""}
            ${patient.last_name || ""}
            ${patient.phone || ""}
            ${patient.email || ""}
        `.toLowerCase();

        return patientData.includes(searchText);

    });

    displayPatients(filteredPatients);
}


/* =========================
   ADD PATIENT MODAL
========================= */

function openAddPatient() {

    const modal = document.getElementById("patientModal");
    const form = document.getElementById("patientForm");

    if (form) {
        form.reset();
    }

    if (modal) {
        modal.style.display = "flex";
    }
}


function closeAddPatient() {

    const modal = document.getElementById("patientModal");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =========================
   ADD PATIENT
========================= */

function addPatient(event) {

    event.preventDefault();

    const patientData = {

        patient_code:
            document.getElementById("patient_code").value.trim(),

        first_name:
            document.getElementById("first_name").value.trim(),

        last_name:
            document.getElementById("last_name").value.trim(),

        gender:
            document.getElementById("gender").value,

        date_of_birth:
            document.getElementById("date_of_birth").value,

        phone:
            document.getElementById("phone").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        blood_group:
            document.getElementById("blood_group").value,

        emergency_contact:
            document.getElementById("emergency_contact").value.trim(),

        address:
            document.getElementById("address").value.trim()
    };


    fetch("../backend/api/patients_add.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(patientData)

    })

    .then(response => response.json())

    .then(data => {

        console.log("ADD PATIENT RESPONSE:", data);

        if (data.success) {

            alert("Patient added successfully!");

            closeAddPatient();

            loadPatients();

        } else {

            alert(data.message || "Failed to add patient");

        }

    })

    .catch(error => {

        console.error("Add Patient Error:", error);

        alert("Server error while adding patient");

    });
}


/* =========================
   DELETE PATIENT
========================= */

function deletePatient(id) {

    console.log("Deleting patient ID:", id);

    const confirmDelete = confirm(
        "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
        return;
    }


    fetch("../backend/api/patients_delete.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            id: id
        })

    })

    .then(response => response.json())

    .then(data => {

        console.log("DELETE RESPONSE:", data);

        if (data.success) {

            alert("Patient deleted successfully!");

            loadPatients();

        } else {

            alert(data.message || "Failed to delete patient");

        }

    })

    .catch(error => {

        console.error("Delete Patient Error:", error);

        alert("Server error while deleting patient");

    });
}


/* =========================
   EDIT PATIENT
========================= */

function editPatient(id) {

    console.log("Edit patient ID:", id);

    const patient = patients.find(
        p => parseInt(p.id) === parseInt(id)
    );

    if (!patient) {

        alert("Patient information not found");

        return;
    }


    document.getElementById("patient_code").value =
        patient.patient_code || "";

    document.getElementById("first_name").value =
        patient.first_name || "";

    document.getElementById("last_name").value =
        patient.last_name || "";

    document.getElementById("gender").value =
        patient.gender || "";

    document.getElementById("date_of_birth").value =
        patient.date_of_birth || "";

    document.getElementById("phone").value =
        patient.phone || "";

    document.getElementById("email").value =
        patient.email || "";

    document.getElementById("blood_group").value =
        patient.blood_group || "";

    document.getElementById("emergency_contact").value =
        patient.emergency_contact || "";

    document.getElementById("address").value =
        patient.address || "";


    document.querySelector("#patientModal h2").textContent =
        "Edit Patient";

    document.querySelector("#patientModal .modal-header p").textContent =
        "Update patient information";


    const saveButton =
        document.querySelector("#patientForm .save-btn");

    saveButton.textContent = "Update Patient";


    saveButton.onclick = function (event) {

        event.preventDefault();

        updatePatient(id);

    };


    const modal = document.getElementById("patientModal");

    modal.style.display = "flex";
}


/* =========================
   UPDATE PATIENT
========================= */

function updatePatient(id) {

    const patientData = {

        id: id,

        patient_code:
            document.getElementById("patient_code").value.trim(),

        first_name:
            document.getElementById("first_name").value.trim(),

        last_name:
            document.getElementById("last_name").value.trim(),

        gender:
            document.getElementById("gender").value,

        date_of_birth:
            document.getElementById("date_of_birth").value,

        phone:
            document.getElementById("phone").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        blood_group:
            document.getElementById("blood_group").value,

        emergency_contact:
            document.getElementById("emergency_contact").value.trim(),

        address:
            document.getElementById("address").value.trim()
    };


    fetch("../backend/api/patients_update.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(patientData)

    })

    .then(response => response.json())

    .then(data => {

        console.log("UPDATE RESPONSE:", data);

        if (data.success) {

            alert("Patient updated successfully!");

            closeAddPatient();

            resetPatientForm();

            loadPatients();

        } else {

            alert(data.message || "Failed to update patient");

        }

    })

    .catch(error => {

        console.error("Update Patient Error:", error);

        alert("Server error while updating patient");

    });
}


/* =========================
   RESET FORM
========================= */

function resetPatientForm() {

    const form = document.getElementById("patientForm");

    if (form) {
        form.reset();
    }

    document.querySelector("#patientModal h2").textContent =
        "Add Patient";

    document.querySelector("#patientModal .modal-header p").textContent =
        "Enter patient information";

    const saveButton =
        document.querySelector("#patientForm .save-btn");

    saveButton.textContent = "Add Patient";

    saveButton.onclick = null;
}


/* =========================
   CLOSE MODAL
========================= */

window.addEventListener("click", function (event) {

    const modal = document.getElementById("patientModal");

    if (event.target === modal) {

        closeAddPatient();

    }

});