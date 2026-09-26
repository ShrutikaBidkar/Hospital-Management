let users = [];
let editMode = false;


document.addEventListener("DOMContentLoaded", () => {

    loadUsers();

    document
        .getElementById("addUserBtn")
        .addEventListener("click", openAddModal);

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("cancelBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("userForm")
        .addEventListener("submit", saveUser);

    document
        .getElementById("searchInput")
        .addEventListener("input", searchUsers);

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

});


/* Load Users */

async function loadUsers() {

    try {

        const response = await fetch(
            "../backend/api/users_list.php"
        );

        const result = await response.json();

        if (result.success) {

            users = result.data;

            displayUsers(users);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Failed to load users");

    }

}


/* Display Users */

function displayUsers(data) {

    const tbody = document.getElementById("usersTableBody");

    tbody.innerHTML = "";

    if (data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No users found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(user => {

        const roleClass =
            user.role === "Admin"
                ? "role-admin"
                : "role-nurse";


        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${user.user_id}</td>

            <td>${user.username}</td>

            <td>
                <span class="${roleClass}">
                    ${user.role}
                </span>
            </td>

            <td>${user.created_at}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editUser(${user.user_id}, '${user.role}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteUser(${user.user_id}, '${user.role}')"
                >
                    Delete
                </button>

            </td>

        `;

        tbody.appendChild(row);

    });

}


/* Open Add Modal */

function openAddModal() {

    editMode = false;

    document.getElementById("modalTitle").innerText =
        "Add User";

    document.getElementById("userForm").reset();

    document.getElementById("userId").value = "";

    document.getElementById("password").required = true;

    document.getElementById("passwordHelp").innerText =
        "Required when adding a new user";

    document.getElementById("userModal").style.display =
        "block";
}


/* Edit User */

function editUser(id, role) {

    const user = users.find(
        item =>
            Number(item.user_id) === Number(id) &&
            item.role === role
    );

    if (!user) {

        alert("User not found");

        return;
    }

    editMode = true;

    document.getElementById("modalTitle").innerText =
        "Edit User";

    document.getElementById("userId").value =
        user.user_id;

    document.getElementById("username").value =
        user.username;

    document.getElementById("role").value =
        user.role;

    document.getElementById("password").value = "";

    document.getElementById("password").required = false;

    document.getElementById("passwordHelp").innerText =
        "Leave blank to keep the current password";

    document.getElementById("userModal").style.display =
        "block";
}


/* Save User */

async function saveUser(event) {

    event.preventDefault();


    const id =
        document.getElementById("userId").value;

    const username =
        document.getElementById("username").value.trim();

    const role =
        document.getElementById("role").value;

    const password =
        document.getElementById("password").value;


    if (!username || !role) {

        alert("Username and role are required");

        return;
    }


    if (!editMode && !password) {

        alert("Password is required");

        return;
    }


    const data = {

        id: id,
        username: username,
        role: role,
        password: password

    };


    const api =
        editMode
            ? "../backend/api/users_update.php"
            : "../backend/api/users_add.php";


    try {

        const response = await fetch(api, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        if (result.success) {

            alert(result.message);

            closeModal();

            loadUsers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

}


/* Delete User */

async function deleteUser(id, role) {

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }


    try {

        const response = await fetch(
            "../backend/api/users_delete.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id: id,
                    role: role
                })
            }
        );


        const result = await response.json();


        if (result.success) {

            alert(result.message);

            loadUsers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Failed to delete user");

    }

}


/* Search */

function searchUsers() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const filtered = users.filter(user =>

        user.username
            .toLowerCase()
            .includes(keyword)

        ||

        user.role
            .toLowerCase()
            .includes(keyword)

    );


    displayUsers(filtered);

}


/* Close Modal */

function closeModal() {

    document.getElementById("userModal").style.display =
        "none";

}


/* Logout */

async function logout() {

    try {

        await fetch(
            "../backend/api/logout.php"
        );

        window.location.href = "../login.html";

    } catch (error) {

        console.error(error);

        window.location.href = "../login.html";

    }

}
