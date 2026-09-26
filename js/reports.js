document.addEventListener("DOMContentLoaded", () => {

    loadSummary();
    loadAppointments();
    loadAdmissions();
    loadBills();


    document
        .getElementById("refreshAppointments")
        .addEventListener("click", loadAppointments);


    document
        .getElementById("refreshAdmissions")
        .addEventListener("click", loadAdmissions);


    document
        .getElementById("refreshBills")
        .addEventListener("click", loadBills);


    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

});


/* =========================
   SUMMARY
========================= */

async function loadSummary() {

    try {

        const response = await fetch(
            "../backend/api/reports.php"
        );

        const result = await response.json();


        if (!result.success) {

            alert(result.message);
            return;

        }


        const data = result.data;


        document.getElementById("totalPatients").innerText =
            data.patients;

        document.getElementById("totalDoctors").innerText =
            data.doctors;

        document.getElementById("totalDepartments").innerText =
            data.departments;

        document.getElementById("totalAppointments").innerText =
            data.appointments;

        document.getElementById("activeAdmissions").innerText =
            data.admissions;

        document.getElementById("totalMedicines").innerText =
            data.medicines;

        document.getElementById("totalMedicalRecords").innerText =
            data.medical_records;

        document.getElementById("totalPrescriptions").innerText =
            data.prescriptions;

        document.getElementById("totalBills").innerText =
            data.bills;


        document.getElementById("totalRevenue").innerText =
            "₹" + Number(data.revenue).toFixed(2);

        document.getElementById("paidAmount").innerText =
            "₹" + Number(data.paid).toFixed(2);

        document.getElementById("pendingAmount").innerText =
            "₹" + Number(data.pending).toFixed(2);


    } catch (error) {

        console.error("Summary Error:", error);

    }

}


/* =========================
   APPOINTMENTS
========================= */

async function loadAppointments() {

    try {

        const response = await fetch(
            "../backend/api/appointments_list.php"
        );

        const result = await response.json();

        const tbody =
            document.getElementById("appointmentsBody");

        tbody.innerHTML = "";


        if (
            !result.success ||
            result.data.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No appointments found
                    </td>
                </tr>
            `;

            return;
        }


        result.data.forEach(appointment => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${appointment.id}</td>

                <td>${appointment.patient_name}</td>

                <td>${appointment.doctor_name}</td>

                <td>${appointment.appointment_date}</td>

                <td>${appointment.appointment_time}</td>

                <td>${appointment.status}</td>

            `;

            tbody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Appointment Error:",
            error
        );

    }

}


/* =========================
   ADMISSIONS
========================= */

async function loadAdmissions() {

    try {

        const response = await fetch(
            "../backend/api/admissions_list.php"
        );

        const result = await response.json();

        const tbody =
            document.getElementById("admissionsBody");

        tbody.innerHTML = "";


        if (
            !result.success ||
            result.data.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No admissions found
                    </td>
                </tr>
            `;

            return;
        }


        result.data.forEach(admission => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${admission.id}</td>

                <td>${admission.patient_name}</td>

                <td>${admission.admission_date}</td>

                <td>
                    ${admission.discharge_date || "-"}
                </td>

                <td>
                    ${admission.room_number || "-"}
                </td>

                <td>${admission.status}</td>

            `;

            tbody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Admission Error:",
            error
        );

    }

}


/* =========================
   BILLING
========================= */

async function loadBills() {

    try {

        const response = await fetch(
            "../backend/api/bills_list.php"
        );

        const result = await response.json();

        const tbody =
            document.getElementById("billsBody");

        tbody.innerHTML = "";


        if (
            !result.success ||
            result.data.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No bills found
                    </td>
                </tr>
            `;

            return;
        }


        result.data.forEach(bill => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${bill.id}</td>

                <td>${bill.invoice_number}</td>

                <td>${bill.patient_name}</td>

                <td>
                    ₹${Number(bill.total_amount).toFixed(2)}
                </td>

                <td>${bill.payment_status}</td>

                <td>${bill.billing_date}</td>

            `;

            tbody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Billing Error:",
            error
        );

    }

}


/* =========================
   LOGOUT
========================= */

async function logout() {

    try {

        await fetch(
            "../backend/api/logout.php"
        );

    } catch (error) {

        console.error(error);

    }

    window.location.href = "../login.html";

}