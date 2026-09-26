// ==========================================
// DOCTORS MODULE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Doctors JS loaded successfully");

    loadDoctors();

});


// ==========================================
// OPEN ADD DOCTOR MODAL
// ==========================================

window.openAddDoctor = function () {

    const modal = document.getElementById("doctorModal");

    if (!modal) {

        console.error("doctorModal not found");

        return;
    }

    // Make sure it is ADD mode
    const form = document.getElementById("doctorForm");

    if (form) {
        form.removeAttribute("data-edit-id");
        form.reset();
    }

    const heading =
        document.querySelector("#doctorModal .modal-header h2");

    if (heading) {
        heading.textContent = "Add New Doctor";
    }

    const description =
        document.querySelector("#doctorModal .modal-header p");

    if (description) {
        description.textContent = "Enter doctor information";
    }

    const saveButton =
        document.querySelector("#doctorForm .save-btn");

    if (saveButton) {
        saveButton.textContent = "Add Doctor";
    }

    modal.style.display = "flex";

};


// ==========================================
// CLOSE DOCTOR MODAL
// ==========================================

window.closeAddDoctor = function () {

    const modal = document.getElementById("doctorModal");

    if (modal) {

        modal.style.display = "none";

    }

    const form = document.getElementById("doctorForm");

    if (form) {

        form.reset();

        form.removeAttribute("data-edit-id");

    }

    const heading =
        document.querySelector("#doctorModal .modal-header h2");

    if (heading) {
        heading.textContent = "Add New Doctor";
    }

    const description =
        document.querySelector("#doctorModal .modal-header p");

    if (description) {
        description.textContent = "Enter doctor information";
    }

    const saveButton =
        document.querySelector("#doctorForm .save-btn");

    if (saveButton) {
        saveButton.textContent = "Add Doctor";
    }

};


// ==========================================
// LOAD DOCTORS
// ==========================================

function loadDoctors() {

    fetch("../backend/api/doctors_list.php")

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            console.log("Doctors:", data);

            if (data.success) {

                displayDoctors(data.data);

            } else {

                alert(
                    data.message ||
                    "Unable to load doctors."
                );

            }

        })

        .catch(function (error) {

            console.error(
                "Load Doctors Error:",
                error
            );

        });

}


// ==========================================
// DISPLAY DOCTORS
// ==========================================

function displayDoctors(doctorsList) {

    const tableBody =
        document.getElementById("doctorTableBody");

    if (!tableBody) {

        return;

    }

    tableBody.innerHTML = "";


    if (
        !doctorsList ||
        doctorsList.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No doctors found.
                </td>
            </tr>
        `;

        return;

    }


    doctorsList.forEach(function (doctor) {

        const row =
            document.createElement("tr");


        const doctorName =
            (doctor.first_name || "") +
            " " +
            (doctor.last_name || "");


        row.innerHTML = `

            <td>${doctor.id || "-"}</td>

            <td>${doctor.doctor_code || "-"}</td>

            <td>${doctorName}</td>

            <td>
                ${doctor.specialization || "-"}
            </td>

            <td>
                ${doctor.phone || "-"}
            </td>

            <td>
                ${doctor.email || "-"}
            </td>

            <td>
                ${
                    doctor.department_name ||
                    doctor.department_id ||
                    "-"
                }
            </td>

            <td>

                <button
                    type="button"
                    onclick="editDoctor(${doctor.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onclick="deleteDoctor(${doctor.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ==========================================
// ADD DOCTOR
// ==========================================

window.addDoctor = function (event) {

    event.preventDefault();


    console.log("Add/Update Doctor function called");


    // ======================================
    // CHECK EDIT MODE
    // ======================================

    const form =
        document.getElementById("doctorForm");

    const editId =
        form.dataset.editId;


    if (editId) {

        updateDoctor(editId);

        return;

    }


    // ======================================
    // ADD MODE
    // ======================================

    const doctorData = {

        doctor_code:
            document
                .getElementById("doctor_code")
                .value
                .trim(),

        first_name:
            document
                .getElementById("first_name")
                .value
                .trim(),

        last_name:
            document
                .getElementById("last_name")
                .value
                .trim(),

        specialization:
            document
                .getElementById("specialization")
                .value
                .trim(),

        phone:
            document
                .getElementById("phone")
                .value
                .trim(),

        email:
            document
                .getElementById("email")
                .value
                .trim(),

        username:
            document
                .getElementById("username")
                .value
                .trim(),

        password:
            document
                .getElementById("password")
                .value,

        department_id:
            document
                .getElementById("department_id")
                .value || null

    };


    console.log(
        "Doctor Data:",
        doctorData
    );


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !doctorData.doctor_code ||
        !doctorData.first_name ||
        !doctorData.specialization ||
        !doctorData.username ||
        !doctorData.password
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    // ======================================
    // SEND ADD REQUEST
    // ======================================

    fetch(
        "../backend/api/doctors_add.php",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(doctorData)

        }
    )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Add Doctor Response:",
                data
            );


            if (data.success) {

                alert(
                    "Doctor added successfully!"
                );


                closeAddDoctor();

                loadDoctors();


            } else {

                alert(
                    data.message ||
                    "Doctor could not be added."
                );

            }

        })

        .catch(function (error) {

            console.error(
                "Add Doctor Error:",
                error
            );

            alert(
                "Error while adding doctor."
            );

        });

};


// ==========================================
// SEARCH DOCTORS
// ==========================================

window.searchDoctors = function () {

    const input =
        document.getElementById("searchDoctor");

    if (!input) {

        return;

    }


    const searchText =
        input.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#doctorTableBody tr"
        );


    rows.forEach(function (row) {

        const text =
            row.innerText.toLowerCase();


        row.style.display =
            text.includes(searchText)
                ? ""
                : "none";

    });

};


// ==========================================
// EDIT DOCTOR
// ==========================================

window.editDoctor = function (id) {

    fetch("../backend/api/doctors_list.php")

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            if (!data.success) {

                alert(
                    data.message ||
                    "Unable to load doctor."
                );

                return;
            }


            const doctor =
                data.data.find(function (item) {

                    return String(item.id) === String(id);

                });


            if (!doctor) {

                alert("Doctor not found.");

                return;
            }


            // Fill form
            document.getElementById("doctor_code").value =
                doctor.doctor_code || "";

            document.getElementById("first_name").value =
                doctor.first_name || "";

            document.getElementById("last_name").value =
                doctor.last_name || "";

            document.getElementById("specialization").value =
                doctor.specialization || "";

            document.getElementById("phone").value =
                doctor.phone || "";

            document.getElementById("email").value =
                doctor.email || "";

            document.getElementById("department_id").value =
                doctor.department_id || "";


            // Username and password are not changed
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";


            // Change heading
            const heading =
                document.querySelector(
                    "#doctorModal .modal-header h2"
                );

            if (heading) {

                heading.textContent =
                    "Edit Doctor";

            }


            // Change description
            const description =
                document.querySelector(
                    "#doctorModal .modal-header p"
                );

            if (description) {

                description.textContent =
                    "Update doctor information";

            }


            // Change button
            const saveButton =
                document.querySelector(
                    "#doctorForm .save-btn"
                );

            if (saveButton) {

                saveButton.textContent =
                    "Update Doctor";

            }


            // Store ID
            document
                .getElementById("doctorForm")
                .dataset.editId = id;


            // Open modal
            document
                .getElementById("doctorModal")
                .style.display = "flex";

        })

        .catch(function (error) {

            console.error(
                "Edit Doctor Error:",
                error
            );

            alert(
                "Error while loading doctor."
            );

        });

};


// ==========================================
// UPDATE DOCTOR
// ==========================================

function updateDoctor(id) {

    console.log(
        "Updating Doctor ID:",
        id
    );


    const doctorData = {

        id: id,

        doctor_code:
            document
                .getElementById("doctor_code")
                .value
                .trim(),

        first_name:
            document
                .getElementById("first_name")
                .value
                .trim(),

        last_name:
            document
                .getElementById("last_name")
                .value
                .trim(),

        specialization:
            document
                .getElementById("specialization")
                .value
                .trim(),

        phone:
            document
                .getElementById("phone")
                .value
                .trim(),

        email:
            document
                .getElementById("email")
                .value
                .trim(),

        department_id:
            document
                .getElementById("department_id")
                .value || null

    };


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !doctorData.doctor_code ||
        !doctorData.first_name ||
        !doctorData.specialization
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    // ======================================
    // SEND UPDATE REQUEST
    // ======================================

    fetch(
        "../backend/api/doctors_update.php",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(doctorData)

        }
    )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Update Doctor Response:",
                data
            );


            if (data.success) {

                alert(
                    "Doctor updated successfully!"
                );


                closeAddDoctor();

                loadDoctors();


            } else {

                alert(
                    data.message ||
                    "Doctor could not be updated."
                );

            }

        })

        .catch(function (error) {

            console.error(
                "Update Doctor Error:",
                error
            );

            alert(
                "Error while updating doctor."
            );

        });

}


// ==========================================
// DELETE DOCTOR
// ==========================================

window.deleteDoctor = function (id) {

    if (!confirm(
        "Are you sure you want to delete this doctor?"
    )) {

        return;

    }


    fetch(
        "../backend/api/doctors_delete.php",
        {

            method: "DELETE",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                id: id

            })

        }
    )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Delete Response:",
                data
            );


            if (data.success) {

                alert(
                    "Doctor deleted successfully!"
                );

                loadDoctors();

            } else {

                alert(
                    data.message ||
                    "Unable to delete doctor."
                );

            }

        })

        .catch(function (error) {

            console.error(
                "Delete Error:",
                error
            );

            alert(
                "Error while deleting doctor."
            );

        });

};