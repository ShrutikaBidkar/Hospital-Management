```javascript
document.addEventListener("DOMContentLoaded", function () {
    loadReceptionistDashboard();
});


function loadReceptionistDashboard() {

    fetch("../backend/api/receptionist_dashboard.php")
        .then(response => response.json())
        .then(data => {

            console.log("Dashboard API Data:", data);

            if (!data.success) {
                console.error("Dashboard Error:", data.message);
                return;
            }


            // =========================
            // RECEPTIONIST NAME
            // =========================

            const nameElement =
                document.getElementById("receptionistName");

            if (nameElement) {
                nameElement.innerText =
                    data.receptionist || "Receptionist";
            }


            // =========================
            // TOTAL PATIENTS
            // =========================

            const patientsElement =
                document.getElementById("totalPatients");

            if (patientsElement) {
                patientsElement.innerText =
                    data.total_patients;
            }


            // =========================
            // TODAY'S APPOINTMENTS
            // =========================

            const appointmentsElement =
                document.getElementById("todayAppointments");

            if (appointmentsElement) {
                appointmentsElement.innerText =
                    data.today_appointments;
            }


            // =========================
            // CURRENT ADMISSIONS
            // =========================

            const admissionsElement =
                document.getElementById("todayAdmissions");

            if (admissionsElement) {
                admissionsElement.innerText =
                    data.current_admissions;
            }


            // =========================
            // PENDING BILLS
            // =========================

            const billsElement =
                document.getElementById("pendingBills");

            if (billsElement) {
                billsElement.innerText =
                    data.pending_bills;
            }


            // =========================
            // TODAY'S APPOINTMENTS TABLE
            // =========================

            const tableBody =
                document.getElementById("appointmentTableBody");

            if (!tableBody) {
                return;
            }

            tableBody.innerHTML = "";


            if (
                !data.appointments ||
                data.appointments.length === 0
            ) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty">
                            No appointments today
                        </td>
                    </tr>
                `;

                return;
            }


            data.appointments.forEach(function (appointment) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>
                        ${appointment.patient_name || ""}
                    </td>

                    <td>
                        ${appointment.doctor_name || ""}
                    </td>

                    <td>
                        ${appointment.appointment_date || ""}
                    </td>

                    <td>
                        ${appointment.appointment_time || ""}
                    </td>

                    <td>
                        <span class="status">
                            ${appointment.status || "Scheduled"}
                        </span>
                    </td>
                `;


                tableBody.appendChild(row);

            });

        })

        .catch(function (error) {

            console.error(
                "Receptionist Dashboard Error:",
                error
            );

        });
}
```
