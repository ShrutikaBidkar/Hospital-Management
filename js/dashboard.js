document.addEventListener("DOMContentLoaded", function () {

    loadDashboardData();

});


async function loadDashboardData() {

    try {

        const response = await fetch(
            "../backend/api/dashboard.php",
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const result = await response.json();

        console.log("Dashboard API Response:", result);


        if (result.success) {

            // Total Patients

            document.getElementById("totalPatients").textContent =
                result.data.patients;


            // Total Doctors

            document.getElementById("totalDoctors").textContent =
                result.data.doctors;


            // Total Appointments

            document.getElementById("totalAppointments").textContent =
                result.data.appointments;


            // Available Beds / Active Admissions

            document.getElementById("availableBeds").textContent =
                result.data.admissions;

        }

        else {

            console.error(
                "Dashboard API Error:",
                result.message
            );

        }

    }

    catch (error) {

        console.error(
            "Dashboard Loading Error:",
            error
        );

    }

}


/* LOGOUT */

async function logout() {

    try {

        await fetch(
            "../backend/api/logout.php",
            {
                method: "GET",
                credentials: "include"
            }
        );

    }

    catch (error) {

        console.log(
            "Logout error:",
            error
        );

    }


    window.location.href = "../login.html";

}