document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "../login.html";
        return;
    }

    if (user.role !== "doctor") {
        alert("Access denied.");
        window.location.href = "../index.html";
        return;
    }

    // Doctor name
    const doctorName = user.name || user.username || "Doctor";

    document.getElementById("doctorName").innerText =
        "Dr. " + doctorName;

    document.getElementById("welcomeName").innerText =
        doctorName;

    loadDoctorDashboard();
});


function loadDoctorDashboard() {

    fetch("../backend/api/doctor_dashboard.php")
        .then(response => response.json())
        .then(data => {

            console.log("Doctor Dashboard:", data);

            if (!data.success) {

                alert(data.message || "Unable to load dashboard.");

                return;
            }

            document.getElementById("totalPatients").innerText =
                data.total_patients || 0;

            document.getElementById("totalAppointments").innerText =
                data.total_appointments || 0;

            document.getElementById("totalRecords").innerText =
                data.total_records || 0;

            document.getElementById("totalPrescriptions").innerText =
                data.total_prescriptions || 0;

            displayTodayAppointments(data.today_appointments || []);

        })
        .catch(error => {

            console.error("Dashboard Error:", error);

        });
}


function displayTodayAppointments(appointments) {

    const tableBody =
        document.getElementById("todayAppointments");

    tableBody.innerHTML = "";

    if (appointments.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No appointments for today.
                </td>
            </tr>
        `;

        return;
    }

    appointments.forEach(appointment => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.patient_name || "Unknown"}</td>

            <td>${appointment.appointment_time || "-"}</td>

            <td>${appointment.reason || "-"}</td>

            <td>${appointment.status || "-"}</td>
        `;

        tableBody.appendChild(row);

    });
}


function logout() {

    fetch("../backend/api/logout.php")
        .then(() => {

            localStorage.removeItem("user");
            localStorage.removeItem("selectedRole");

            window.location.href = "../index.html";

        })
        .catch(() => {

            localStorage.removeItem("user");
            localStorage.removeItem("selectedRole");

            window.location.href = "../index.html";

        });
}