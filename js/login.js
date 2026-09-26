const selectedRole = localStorage.getItem("selectedRole");


// If role is not selected
if (!selectedRole) {
    window.location.href = "index.html";
}


// Show role title
const roleTitle = document.getElementById("roleTitle");

if (roleTitle) {
    roleTitle.innerText =
        selectedRole.charAt(0).toUpperCase() +
        selectedRole.slice(1) +
        " Login";
}


// Login form
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (username === "" || password === "") {

        alert("Please enter username and password");
        return;
    }


    try {

        const response = await fetch(
            "/Hospital-management-system/backend/api/login.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: selectedRole
                })
            }
        );


        const text = await response.text();

        console.log("Server Response:", text);


        let data;

        try {

            data = JSON.parse(text);

        } catch (error) {

            console.error("JSON ERROR:", error);

            alert("Server returned an invalid response. Check PHP error.");

            return;
        }


        if (data.success) {

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // =========================
            // REDIRECT ACCORDING TO ROLE
            // =========================

            // ADMIN
            if (data.user.role === "admin") {

                window.location.href =
                    "frontend/dashboard.html";

            }

            // NURSE
            else if (data.user.role === "nurse") {

                window.location.href =
                    "frontend/nurse-dashboard.html";

            }

            // DOCTOR
            else if (data.user.role === "doctor") {

                window.location.href =
                    "frontend/doctor-dashboard.html";

            }
            // RECEPTIONIST
            else if (data.user.role === "receptionist") {

                 window.location.href =
                      "frontend/receptionist-dashboard.html";

}

            // UNKNOWN ROLE
            else {

                alert("Dashboard for this role is not created yet.");

            }

        }

        else {

            alert(data.message);

        }


    } catch (error) {

        console.error("Login Error:", error);

        alert("Unable to connect to server.");

    }

});