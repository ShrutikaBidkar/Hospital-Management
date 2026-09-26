const API_URL = "../backend/api/";

const tableBody =
    document.getElementById("appointmentTableBody");

const modal =
    document.getElementById("appointmentModal");

const form =
    document.getElementById("appointmentForm");

const appointmentId =
    document.getElementById("appointmentId");

const patientId =
    document.getElementById("patientId");

const doctorId =
    document.getElementById("doctorId");

const appointmentDate =
    document.getElementById("appointmentDate");

const appointmentTime =
    document.getElementById("appointmentTime");

const reason =
    document.getElementById("reason");

const status =
    document.getElementById("status");

const modalTitle =
    document.getElementById("modalTitle");

const addAppointmentBtn =
    document.getElementById("addAppointmentBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const searchAppointment =
    document.getElementById("searchAppointment");


let appointments = [];


// =================================
// LOAD APPOINTMENTS
// =================================

async function loadAppointments() {

    try {

        const response = await fetch(
            API_URL + "appointments_list.php"
        );

        const result = await response.json();

        if (result.success) {

            appointments = result.data;

            displayAppointments(appointments);

        } else {

            showMessage(result.message);

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "Failed to load appointments."
        );

    }
}


// =================================
// DISPLAY APPOINTMENTS
// =================================

function displayAppointments(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No appointments found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(appointment => {

        let statusClass =
            appointment.status.toLowerCase();

        statusClass =
            statusClass.replace(" ", "-");


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${appointment.id}</td>

            <td>
                ${appointment.patient_name}
            </td>

            <td>
                ${appointment.doctor_name}
            </td>

            <td>
                ${appointment.appointment_date}
            </td>

            <td>
                ${appointment.appointment_time}
            </td>

            <td>
                ${appointment.reason || ""}
            </td>

            <td>
                <span class="status status-${statusClass}">
                    ${appointment.status}
                </span>
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editAppointment(${appointment.id})"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteAppointment(${appointment.id})"
                >
                    Delete
                </button>

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
// LOAD DOCTORS
// =================================

async function loadDoctors() {

    try {

        const response = await fetch(
            API_URL + "doctors_list.php"
        );

        const result = await response.json();

        if (!result.success) {
            return;
        }


        doctorId.innerHTML = `
            <option value="">
                Select Doctor
            </option>
        `;


        result.data.forEach(doctor => {

            const option =
                document.createElement("option");

            option.value = doctor.id;

            option.textContent =
                "Dr. " +
                doctor.first_name +
                " " +
                (doctor.last_name || "");

            doctorId.appendChild(option);

        });

    } catch (error) {

        console.error(error);

    }
}


// =================================
// OPEN ADD MODAL
// =================================

addAppointmentBtn.addEventListener(
    "click",
    async function() {

        form.reset();

        appointmentId.value = "";

        modalTitle.innerText =
            "Add Appointment";

        await loadPatients();

        await loadDoctors();

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
    async function(event) {

        event.preventDefault();


        const id =
            appointmentId.value;


        const data = {

            patient_id:
                patientId.value,

            doctor_id:
                doctorId.value,

            appointment_date:
                appointmentDate.value,

            appointment_time:
                appointmentTime.value,

            reason:
                reason.value.trim(),

            status:
                status.value

        };


        let url;


        if (id) {

            data.id = id;

            url =
                API_URL +
                "appointments_update.php";

        } else {

            url =
                API_URL +
                "appointments_add.php";

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

                loadAppointments();

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
// EDIT APPOINTMENT
// =================================

async function editAppointment(id) {

    const appointment =
        appointments.find(
            item => item.id == id
        );


    if (!appointment) {
        return;
    }


    await loadPatients();

    await loadDoctors();


    appointmentId.value =
        appointment.id;

    patientId.value =
        appointment.patient_id;

    doctorId.value =
        appointment.doctor_id;

    appointmentDate.value =
        appointment.appointment_date;

    appointmentTime.value =
        appointment.appointment_time;

    reason.value =
        appointment.reason || "";

    status.value =
        appointment.status;


    modalTitle.innerText =
        "Edit Appointment";

    modal.style.display =
        "block";
}


// =================================
// DELETE APPOINTMENT
// =================================

async function deleteAppointment(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this appointment?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL +
                "appointments_delete.php",
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

            loadAppointments();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete appointment."
        );

    }
}


// =================================
// SEARCH
// =================================

searchAppointment.addEventListener(
    "input",
    function() {

        const search =
            this.value.toLowerCase();


        const filtered =
            appointments.filter(
                appointment =>

                    appointment.patient_name
                        .toLowerCase()
                        .includes(search)

                    ||

                    appointment.doctor_name
                        .toLowerCase()
                        .includes(search)

                    ||

                    appointment.status
                        .toLowerCase()
                        .includes(search)

            );


        displayAppointments(filtered);

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

loadAppointments();