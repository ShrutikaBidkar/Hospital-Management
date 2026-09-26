let records = [];

let patients = [];

let doctors = [];

let editMode = false;


document.addEventListener("DOMContentLoaded", function () {

    loadPatients();

    loadDoctors();

    loadRecords();

    setTodayDate();

    document
        .getElementById("recordForm")
        .addEventListener("submit", saveRecord);

});


/* ================================
   LOAD PATIENTS
================================ */

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

            patients.forEach(function (patient) {

                const option =
                    document.createElement("option");

                option.value = patient.id;

                option.textContent =
                    patient.patient_code +
                    " - " +
                    patient.first_name +
                    " " +
                    (patient.last_name || "");

                select.appendChild(option);

            });

        }

    } catch (error) {

        console.error(
            "Patient loading error:",
            error
        );

    }

}


/* ================================
   LOAD DOCTORS
================================ */

async function loadDoctors() {

    try {

        const response = await fetch(
            "../backend/api/doctors_list.php"
        );

        const result = await response.json();

        if (result.success) {

            doctors = result.data;

            const select =
                document.getElementById("doctorId");

            select.innerHTML =
                '<option value="">Select Doctor</option>';

            doctors.forEach(function (doctor) {

                const option =
                    document.createElement("option");

                option.value = doctor.id;

                option.textContent =
                    doctor.doctor_code +
                    " - Dr. " +
                    doctor.first_name +
                    " " +
                    (doctor.last_name || "");

                select.appendChild(option);

            });

        }

    } catch (error) {

        console.error(
            "Doctor loading error:",
            error
        );

    }

}


/* ================================
   LOAD RECORDS
================================ */

async function loadRecords() {

    try {

        const response = await fetch(
            "../backend/api/medical_records_list.php"
        );

        const result = await response.json();

        console.log(
            "Medical Records API:",
            result
        );

        if (result.success) {

            records = result.data;

            displayRecords(records);

        } else {

            showMessage(
                "Failed to load records"
            );

        }

    } catch (error) {

        console.error(
            "Records loading error:",
            error
        );

        showMessage(
            "Unable to load medical records"
        );

    }

}


/* ================================
   DISPLAY RECORDS
================================ */

function displayRecords(data) {

    const tbody =
        document.getElementById("recordsTableBody");

    tbody.innerHTML = "";


    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    No medical records found
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(function (record) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${record.id}</td>

            <td>
                ${record.patient_name || "-"}
            </td>

            <td>
                ${record.doctor_name || "-"}
            </td>

            <td>
                ${record.diagnosis || "-"}
            </td>

            <td>
                ${record.symptoms || "-"}
            </td>

            <td>
                ${record.treatment || "-"}
            </td>

            <td>
                ${record.record_date || "-"}
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editRecord(${record.id})">

                    Edit

                </button>

                <button
                    class="view-btn"
                    onclick="viewRecord(${record.id})">

                    View

                </button>

            </td>

        `;

        tbody.appendChild(row);

    });

}


/* ================================
   OPEN ADD MODAL
================================ */

function openAddModal() {

    editMode = false;

    document.getElementById("modalTitle")
        .textContent = "Add Medical Record";

    document.getElementById("recordForm")
        .reset();

    document.getElementById("recordId")
        .value = "";

    setTodayDate();

    document.getElementById("recordModal")
        .classList.add("show");

}


/* ================================
   CLOSE MODAL
================================ */

function closeModal() {

    document.getElementById("recordModal")
        .classList.remove("show");

}


/* ================================
   SET TODAY
================================ */

function setTodayDate() {

    const dateInput =
        document.getElementById("recordDate");

    if (!dateInput.value) {

        const today =
            new Date().toISOString().split("T")[0];

        dateInput.value = today;

    }

}


/* ================================
   SAVE RECORD
================================ */

async function saveRecord(event) {

    event.preventDefault();


    const data = {

        id:
            document.getElementById("recordId").value,

        patient_id:
            document.getElementById("patientId").value,

        doctor_id:
            document.getElementById("doctorId").value,

        diagnosis:
            document.getElementById("diagnosis").value.trim(),

        symptoms:
            document.getElementById("symptoms").value.trim(),

        treatment:
            document.getElementById("treatment").value.trim(),

        notes:
            document.getElementById("notes").value.trim(),

        record_date:
            document.getElementById("recordDate").value

    };


    const url = editMode
        ? "../backend/api/medical_records_update.php"
        : "../backend/api/medical_records_add.php";


    try {

        const response = await fetch(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        if (result.success) {

            alert(result.message);

            closeModal();

            loadRecords();

        }

        else {

            alert(
                result.message ||
                "Operation failed"
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong"
        );

    }

}


/* ================================
   EDIT RECORD
================================ */

function editRecord(id) {

    const record =
        records.find(function (item) {

            return Number(item.id) === Number(id);

        });


    if (!record) {

        alert("Record not found");

        return;

    }


    editMode = true;


    document.getElementById("modalTitle")
        .textContent = "Edit Medical Record";


    document.getElementById("recordId")
        .value = record.id;


    document.getElementById("patientId")
        .value = record.patient_id;


    document.getElementById("doctorId")
        .value = record.doctor_id || "";


    document.getElementById("diagnosis")
        .value = record.diagnosis || "";


    document.getElementById("symptoms")
        .value = record.symptoms || "";


    document.getElementById("treatment")
        .value = record.treatment || "";


    document.getElementById("notes")
        .value = record.notes || "";


    document.getElementById("recordDate")
        .value = record.record_date || "";


    document.getElementById("recordModal")
        .classList.add("show");

}


/* ================================
   VIEW RECORD
================================ */

function viewRecord(id) {

    const record =
        records.find(function (item) {

            return Number(item.id) === Number(id);

        });


    if (!record) {

        alert("Record not found");

        return;

    }


    alert(

        "Patient: " +
        (record.patient_name || "-") +

        "\nDoctor: " +
        (record.doctor_name || "-") +

        "\nDiagnosis: " +
        (record.diagnosis || "-") +

        "\nSymptoms: " +
        (record.symptoms || "-") +

        "\nTreatment: " +
        (record.treatment || "-") +

        "\nNotes: " +
        (record.notes || "-") +

        "\nRecord Date: " +
        (record.record_date || "-")

    );

}


/* ================================
   SEARCH
================================ */

function searchRecords() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    if (!search) {

        displayRecords(records);

        return;

    }


    const filtered =
        records.filter(function (record) {

            return (

                String(record.patient_name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(record.doctor_name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(record.diagnosis || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(record.symptoms || "")
                    .toLowerCase()
                    .includes(search)

            );

        });


    displayRecords(filtered);

}


/* ================================
   MESSAGE
================================ */

function showMessage(message) {

    const tbody =
        document.getElementById("recordsTableBody");

    tbody.innerHTML = `

        <tr>

            <td colspan="8">
                ${message}
            </td>

        </tr>

    `;

}


/* ================================
   LOGOUT
================================ */

async function logout() {

    try {

        await fetch(
            "../backend/api/logout.php",
            {
                method: "GET",
                credentials: "include"
            }
        );

    } catch (error) {

        console.log(error);

    }


    window.location.href =
        "../login.html";

}