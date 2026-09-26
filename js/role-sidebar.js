(function () {

    const role = localStorage.getItem("selectedRole");

    console.log("ROLE SIDEBAR LOADED");
    console.log("CURRENT ROLE:", role);

    if (!role) {
        window.location.href = "../index.html";
        return;
    }

    const roleMenus = {

        admin: [
            ["dashboard.html", "🏠", "Dashboard"],
            ["patients.html", "👥", "Patients"],
            ["doctors.html", "👨‍⚕️", "Doctors"],
            ["departments.html", "🏥", "Departments"],
            ["appointments.html", "📅", "Appointments"],
            ["admissions.html", "🛏️", "Admissions"],
            ["medical-records.html", "📋", "Medical Records"],
            ["prescriptions.html", "💊", "Prescriptions"],
            ["medicines.html", "💉", "Medicines"],
            ["billing.html", "💰", "Billing"],
            ["users.html", "👤", "Users"],
            ["reports.html", "📊", "Reports"]
        ],

        receptionist: [
            ["receptionist-dashboard.html", "🏠", "Dashboard"],
            ["patients.html", "👥", "Patients"],
            ["appointments.html", "📅", "Appointments"],
            ["admissions.html", "🛏️", "Admissions"],
            ["billing.html", "💰", "Billing"]
        ],

        nurse: [
            ["nurse-dashboard.html", "🏠", "Dashboard"],
            ["patients.html", "👥", "Patients"],
            ["admissions.html", "🛏️", "Admissions"],
            ["medical-records.html", "📋", "Medical Records"],
            ["appointments.html", "📅", "Appointments"]
        ],

        doctor: [
            ["doctor-dashboard.html", "🏠", "Dashboard"],
            ["patients.html", "👥", "Patients"],
            ["appointments.html", "📅", "Appointments"],
            ["medical-records.html", "📋", "Medical Records"],
            ["prescriptions.html", "💊", "Prescriptions"],
            ["admissions.html", "🛏️", "Admissions"],
            ["reports.html", "📊", "Reports"]
        ]

    };

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) {
        console.log("SIDEBAR NOT FOUND");
        return;
    }

    /*
       Find the menu area.
       Different pages use different structures.
    */

    let menu = sidebar.querySelector(".sidebar-nav");

    if (!menu) {
        menu = sidebar.querySelector(".sidebar-menu");
    }

    /*
       Billing page has direct links inside sidebar.
       If no menu container exists, create one.
    */

    if (!menu) {

        menu = document.createElement("div");

        menu.className = "sidebar-menu";

        const links = Array.from(
            sidebar.querySelectorAll(":scope > a")
        );

        links.forEach(function (link) {
            link.remove();
        });

        const logoutButton =
            sidebar.querySelector("#logoutBtn");

        if (logoutButton) {
            logoutButton.remove();
        }

        sidebar.appendChild(menu);
    }

    console.log("SIDEBAR MENU FOUND");

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();

    /*
       Remove old sidebar links
    */

    menu.innerHTML = "";

    /*
       Create role-based sidebar
    */

    roleMenus[role].forEach(function (item) {

        const link = document.createElement("a");

        link.href = item[0];

        link.innerHTML =
            '<span class="menu-icon">' +
            item[1] +
            '</span>' +
            '<span>' +
            item[2] +
            '</span>';

        if (currentPage === item[0]) {
            link.classList.add("active");
        }

        menu.appendChild(link);

    });

    /*
       Logout
    */

    const logoutLink =
        document.createElement("a");

    logoutLink.href = "#";

    logoutLink.innerHTML =
        '<span class="menu-icon">🚪</span>' +
        '<span>Logout</span>';

    logoutLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem("selectedRole");
            localStorage.removeItem("user");

            fetch("../backend/api/logout.php", {
                method: "GET",
                credentials: "include"
            }).finally(function () {

                window.location.href =
                    "../index.html";

            });

        }
    );

    menu.appendChild(logoutLink);

    console.log(
        "ROLE SIDEBAR APPLIED:",
        role
    );

})();