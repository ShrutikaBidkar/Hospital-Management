const API_URL = "../backend/api/";

let departments = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    loadDepartments();
});


// ==========================================
// LOAD DEPARTMENTS
// ==========================================

async function loadDepartments() {

    const tableBody =
        document.getElementById("departmentTableBody");

    if (!tableBody) {
        console.error("departmentTableBody not found");
        return;
    }

    try {

        const response = await fetch(
            API_URL + "departments_list.php"
        );

        const result = await response.json();

        console.log("Department API:", result);

        if (result.success) {

            departments = result.data || [];

            displayDepartments(departments);

        } else {

            showMessage(
                result.message || "Unable to load departments"
            );

        }

    } catch (error) {

        console.error("Department Error:", error);

        showMessage("Failed to load departments.");

    }
}


// ==========================================
// DISPLAY DEPARTMENTS
// ==========================================

function displayDepartments(data) {

    const tableBody =
        document.getElementById("departmentTableBody");

    if (!tableBody) {
        console.error("departmentTableBody not found");
        return;
    }

    tableBody.innerHTML = "";

    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No departments found.
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(function (department) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${department.id}</td>

            <td>${department.department_name || "-"}</td>

            <td>${department.description || "-"}</td>

            <td>${department.created_at || "-"}</td>

            <td>

                <button
                    type="button"
                    class="action-btn edit-btn"
                    onclick="editDepartment(${department.id})">
                    Edit
                </button>

                <button
                    type="button"
                    class="action-btn delete-btn"
                    onclick="deleteDepartment(${department.id})">
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });

}


// ==========================================
// OPEN ADD DEPARTMENT MODAL
// ==========================================

function openAddDepartment() {

    const modal =
        document.getElementById("departmentModal");

    const form =
        document.getElementById("departmentForm");

    const departmentId =
        document.getElementById("departmentId");

    const modalTitle =
        document.getElementById("modalTitle");


    if (!modal) {

        console.error("departmentModal not found");

        return;
    }


    // Reset form
    if (form) {
        form.reset();
    }


    // Clear ID for ADD
    if (departmentId) {
        departmentId.value = "";
    }


    // Change title
    if (modalTitle) {
        modalTitle.innerText = "Add Department";
    }


    // Open ONLY department modal
    modal.style.display = "flex";
}


// ==========================================
// CLOSE DEPARTMENT MODAL
// ==========================================

function closeModal() {

    const modal =
        document.getElementById("departmentModal");

    if (modal) {

        modal.style.display = "none";

    }
}


// Support HTML onclick
function closeAddDepartment() {

    closeModal();

}


// ==========================================
// ADD / UPDATE DEPARTMENT
// ==========================================

async function addDepartment(event) {

    if (event) {
        event.preventDefault();
    }


    const departmentId =
        document.getElementById("departmentId");

    // IMPORTANT:
    // HTML uses department_name
    const departmentName =
        document.getElementById("department_name");

    const description =
        document.getElementById("description");


    if (!departmentName) {

        alert("Department name field not found.");

        return;
    }


    const id =
        departmentId
            ? departmentId.value.trim()
            : "";


    const data = {

        department_name:
            departmentName.value.trim(),

        description:
            description
                ? description.value.trim()
                : ""

    };


    if (!data.department_name) {

        alert("Please enter department name.");

        return;
    }


    let url;


    // EDIT
    if (id) {

        data.id = id;

        url =
            API_URL + "departments_update.php";

    }

    // ADD
    else {

        url =
            API_URL + "departments_add.php";

    }


    try {

        const response =
            await fetch(url, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


        const result =
            await response.json();


        console.log(
            "Department Save:",
            result
        );


        if (result.success) {

            alert(
                result.message ||
                "Department saved successfully."
            );


            closeModal();

            loadDepartments();

        }

        else {

            alert(
                result.message ||
                "Failed to save department."
            );

        }

    }

    catch (error) {

        console.error(
            "Department Save Error:",
            error
        );

        alert(
            "Something went wrong."
        );

    }

}


// ==========================================
// EDIT DEPARTMENT
// ==========================================

function editDepartment(id) {

    const department =
        departments.find(function (d) {

            return d.id == id;

        });


    if (!department) {

        alert("Department not found.");

        return;
    }


    const modal =
        document.getElementById("departmentModal");

    const form =
        document.getElementById("departmentForm");

    const departmentId =
        document.getElementById("departmentId");

    // IMPORTANT:
    // HTML uses department_name
    const departmentName =
        document.getElementById("department_name");

    const description =
        document.getElementById("description");

    const modalTitle =
        document.getElementById("modalTitle");


    if (!modal) {

        alert("Department modal not found.");

        return;
    }


    // Set department ID
    if (departmentId) {

        departmentId.value =
            department.id;

    }


    // Set department name
    if (departmentName) {

        departmentName.value =
            department.department_name || "";

    }


    // Set description
    if (description) {

        description.value =
            department.description || "";

    }


    // Change title
    if (modalTitle) {

        modalTitle.innerText =
            "Edit Department";

    }


    // Open ONLY Department modal
    modal.style.display = "flex";

}


// ==========================================
// DELETE DEPARTMENT
// ==========================================

async function deleteDepartment(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this department?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        const response =
            await fetch(
                API_URL + "departments_delete.php",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: id
                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Department Delete:",
            result
        );


        if (result.success) {

            alert(
                result.message ||
                "Department deleted successfully."
            );

            loadDepartments();

        }

        else {

            alert(
                result.message ||
                "Failed to delete department."
            );

        }

    }

    catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Failed to delete department."
        );

    }

}


// ==========================================
// SEARCH DEPARTMENTS
// ==========================================

function searchDepartments() {

    const searchInput =
        document.getElementById("searchDepartment");


    if (!searchInput) {

        return;
    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        departments.filter(function (department) {

            const name =
                (
                    department.department_name || ""
                ).toLowerCase();


            const description =
                (
                    department.description || ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                description.includes(search)
            );

        });


    displayDepartments(filtered);

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

    const tableMessage =
        document.getElementById("tableMessage");


    if (tableMessage) {

        tableMessage.innerText =
            message;

    }

    else {

        console.log(message);

    }

}


// ==========================================
// CLOSE DEPARTMENT MODAL
// WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById("departmentModal");


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();

        }

    }
);