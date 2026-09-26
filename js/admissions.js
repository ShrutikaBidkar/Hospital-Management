const API_URL = "../backend/api/";

const tableBody =
    document.getElementById("admissionTableBody");

const modal =
    document.getElementById("admissionModal");

const form =
    document.getElementById("admissionForm");

const admissionId =
    document.getElementById("admissionId");

const patientId =
    document.getElementById("patientId");

const admissionDate =
    document.getElementById("admissionDate");

const roomNumber =
    document.getElementById("roomNumber");

const bedNumber =
    document.getElementById("bedNumber");

const diagnosis =
    document.getElementById("diagnosis");

const status =
    document.getElementById("status");

const modalTitle =
    document.getElementById("modalTitle");

const addAdmissionBtn =
    document.getElementById("addAdmissionBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const searchAdmission =
    document.getElementById("searchAdmission");

let admissions = [];


// =================================
// LOAD ADMISSIONS
// =================================

async function loadAdmissions() {

    try {

        const response = await fetch(
            API_URL + "admissions_list.php"
        );

        const result = await response.json();

        if (result.success) {

            admissions = result.data;

            displayAdmissions(admissions);

        } else {

            showMessage(result.message);

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "Failed to load admissions."
        );
    }
}


// =================================
// DISPLAY ADMISSIONS
// =================================

function displayAdmissions(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    No admissions found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(admission => {

        const statusClass =
            admission.status
                .toLowerCase()
                .replace(" ", "-");


        const row =
            document.createElement("tr");


        let actions = `
            <button
                class="action-btn edit-btn"
                onclick="editAdmission(${admission.id})">
                Edit
            </button>

            <button
                class="action-btn delete-btn"
                onclick="deleteAdmission(${admission.id})">
                Delete
            </button>
        `;


        if (admission.status === "Admitted") {

            actions += `
                <button
                    class="action-btn discharge-btn"
                    onclick="dischargePatient(${admission.id})">
                    Discharge
                </button>
            `;
        }


        row.innerHTML = `

            <td>${admission.id}</td>

            <td>
                ${admission.patient_name}
            </td>

            <td>
                ${admission.admission_date}
            </td>

            <td>
                ${admission.discharge_date || "-"}
            </td>

            <td>
                ${admission.room_number || "-"}
            </td>

            <td>
                ${admission.bed_number || "-"}
            </td>

            <td>
                ${admission.diagnosis || "-"}
            </td>

            <td>
                <span class="status status-${statusClass}">
                    ${admission.status}
                </span>
            </td>

            <td>
                ${actions}
            </td>
        `;


        tableBody.appendChild(row);

    });
}


// =================================
// LOAD PATIENTS
// =================================

async function loadPatients() {

    try {

        const response = await fetch(
            API_URL + "patients_list.php"
        );

        const result = await response.json();

        if (!result.success) {
            return;
        }


        patientId.innerHTML = `
            <option value="">
                Select Patient
            </option>
        `;


        result.data.forEach(patient => {

            const option =
                document.createElement("option");

            option.value = patient.id;

            option.textContent =
                patient.first_name +
                " " +
                (patient.last_name || "");

            patientId.appendChild(option);

        });

    } catch (error) {

        console.error(error);

    }
}


// =================================
// OPEN ADD MODAL
// =================================

addAdmissionBtn.addEventListener(
    "click",
    async function () {

        form.reset();

        admissionId.value = "";

        modalTitle.innerText =
            "Add Admission";

        await loadPatients();

        modal.style.display = "block";

    }
);


// =================================
// CLOSE MODAL
// =================================

function closeModal() {

    modal.style.display = "none";

}

closeModalBtn.addEventListener(
    "click",
    closeModal
);

cancelBtn.addEventListener(
    "click",
    closeModal
);


// =================================
// ADD / UPDATE
// =================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            admissionId.value;


        const data = {

            patient_id:
                patientId.value,

            admission_date:
                admissionDate.value,

            room_number:
                roomNumber.value.trim(),

            bed_number:
                bedNumber.value.trim(),

            diagnosis:
                diagnosis.value.trim(),

            status:
                status.value
        };


        let url;


        if (id) {

            data.id = id;

            url =
                API_URL +
                "admissions_update.php";

        } else {

            url =
                API_URL +
                "admissions_add.php";

        }


        try {

            const response =
                await fetch(url, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                });


            const result =
                await response.json();


            if (result.success) {

                alert(result.message);

                closeModal();

                loadAdmissions();

            } else {

                alert(result.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong."
            );

        }

    }
);


// =================================
// EDIT ADMISSION
// =================================

async function editAdmission(id) {

    const admission =
        admissions.find(
            item => item.id == id
        );


    if (!admission) {
        return;
    }


    await loadPatients();


    admissionId.value =
        admission.id;

    patientId.value =
        admission.patient_id;

    admissionDate.value =
        admission.admission_date;

    roomNumber.value =
        admission.room_number || "";

    bedNumber.value =
        admission.bed_number || "";

    diagnosis.value =
        admission.diagnosis || "";

    status.value =
        admission.status;


    modalTitle.innerText =
        "Edit Admission";

    modal.style.display =
        "block";
}


// =================================
// DISCHARGE PATIENT
// =================================

async function dischargePatient(id) {

    const confirmDischarge =
        confirm(
            "Are you sure you want to discharge this patient?"
        );


    if (!confirmDischarge) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL +
                "admissions_discharge.php",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id: id
                        })

                }
            );


        const result =
            await response.json();


        if (result.success) {

            alert(result.message);

            loadAdmissions();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Failed to discharge patient."
        );

    }
}


// =================================
// DELETE ADMISSION
// =================================

async function deleteAdmission(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this admission?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL +
                "admissions_delete.php",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id: id
                        })

                }
            );


        const result =
            await response.json();


        if (result.success) {

            alert(result.message);

            loadAdmissions();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete admission."
        );

    }
}


// =================================
// SEARCH
// =================================

searchAdmission.addEventListener(
    "input",
    function () {

        const search =
            this.value.toLowerCase();


        const filtered =
            admissions.filter(
                admission =>

                    admission.patient_name
                        .toLowerCase()
                        .includes(search)

                    ||

                    (admission.room_number || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (admission.status || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (admission.diagnosis || "")
                        .toLowerCase()
                        .includes(search)
            );


        displayAdmissions(filtered);

    }
);


// =================================
// MESSAGE
// =================================

function showMessage(message) {

    document.getElementById(
        "tableMessage"
    ).innerText = message;

}


// =================================
// INITIAL LOAD
// =================================

loadAdmissions();