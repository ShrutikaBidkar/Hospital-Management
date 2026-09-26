document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // LOGIN CHECK
    // =========================

    const userData = localStorage.getItem("user");

    if (!userData) {
        window.location.href = "../login.html";
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {

        console.error("User data error:", error);

        localStorage.removeItem("user");

        window.location.href = "../login.html";

        return;
    }


    // =========================
    // ROLE CHECK
    // =========================

    if (user.role !== "admin" && user.role !== "nurse") {

        alert("Access denied.");

        window.location.href = "../index.html";

        return;
    }


    // =========================
    // USERNAME
    // =========================

    const nurseUsername =
        document.getElementById("nurseUsername");

    const headerUsername =
        document.getElementById("headerUsername");


    if (nurseUsername) {
        nurseUsername.innerText = user.username;
    }

    if (headerUsername) {
        headerUsername.innerText = user.username;
    }


    // =========================
    // LOAD DASHBOARD
    // =========================

    loadDashboard();


    // =========================
    // LOGOUT
    // =========================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async function () {

            try {

                await fetch(
                    "../backend/api/logout.php",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

            } catch (error) {

                console.log(
                    "Logout API error:",
                    error
                );
            }


            localStorage.removeItem("user");

            localStorage.removeItem("selectedRole");

            window.location.href = "../index.html";
        });
    }

});


// =================================================
// LOAD DASHBOARD
// =================================================

async function loadDashboard() {

    try {

        const response = await fetch(
            "../backend/api/nurse_dashboard.php",
            {
                method: "GET",
                credentials: "include",
                cache: "no-cache"
            }
        );


        const data = await response.json();


        console.log(
            "Nurse Dashboard Data:",
            data
        );


        if (!data.success) {

            console.error(
                "Dashboard API:",
                data.message
            );

            return;
        }


        // =========================
        // TOTAL PATIENTS
        // =========================

        const patients =
            document.getElementById("totalPatients");

        if (patients) {

            patients.innerText =
                data.total_patients;
        }


        // =========================
        // TOTAL ADMISSIONS
        // =========================

        const admissions =
            document.getElementById("totalAdmissions");

        if (admissions) {

            admissions.innerText =
                data.total_admissions;
        }


        // =========================
        // MEDICAL RECORDS
        // =========================

        const records =
            document.getElementById("totalRecords");

        if (records) {

            records.innerText =
                data.total_records;
        }


        // =========================
        // TODAY'S APPOINTMENTS
        // =========================

        displayTodayAppointments(
            data.today_appointments
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}


// =================================================
// DISPLAY TODAY'S APPOINTMENTS
// =================================================

function displayTodayAppointments(appointments) {

    const container =
        document.getElementById(
            "todayAppointments"
        );


    if (!container) {

        console.error(
            "todayAppointments element not found"
        );

        return;
    }


    // =========================
    // NO APPOINTMENTS
    // =========================

    if (
        !appointments ||
        appointments.length === 0
    ) {

        container.innerHTML = `
            <div class="no-appointments">
                No appointments for today.
            </div>
        `;

        return;
    }


    // =========================
    // CLEAR OLD DATA
    // =========================

    container.innerHTML = "";


    // =========================
    // SHOW APPOINTMENTS
    // =========================

    appointments.forEach(function (appointment) {

        let time = appointment.appointment_time;

        if (time) {

            time =
                time.substring(0, 5);
        }


        const appointmentDiv =
            document.createElement("div");

        appointmentDiv.className =
            "appointment-item";


        appointmentDiv.innerHTML = `

            <div class="appointment-info">

                <h4>
                    ${appointment.patient_name || "Unknown Patient"}
                </h4>

                <p>
                    👨‍⚕️ Dr. ${appointment.doctor_name || "Unknown Doctor"}
                </p>

                <p>
                    🕐 ${time || "-"}
                </p>

                <p>
                    📝 ${appointment.reason || "-"}
                </p>

            </div>

            <div class="appointment-status">

                ${appointment.status || "-"}

            </div>
        `;


        container.appendChild(
            appointmentDiv
        );

    });

}