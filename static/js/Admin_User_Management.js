const users = [
    { username: "Nosyba Mohamed", email: "NosybaMohamed@proton.me" },
    { username: "Raneem Tamer Ammar", email: "s-raneem@zewailcity.edu.eg" },
];

const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

function renderUsers() {
    userTable.innerHTML = ''; 
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td class="table-actions">
                <button onclick="openModal(${index})">Change Password</button>
                <button onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        
        userTable.appendChild(row);
    });
}

function openModal(index) {
    const modal = document.getElementById('modal');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const newPasswordInput = document.getElementById('newPassword');

    // When the modal is opened, assign the targeted user
    changePasswordForm.onsubmit = function(event) {
        event.preventDefault();
        users[index].password = newPasswordInput.value;
        alert("Password changed successfully!");
        closeModal();
    };

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function deleteUser(index) {
    if (confirm("Are you sure you want to delete this account?")) {
        users.splice(index, 1); // Delete the user
        renderUsers();
        alert("Account deleted!");
    }
}

// Load users when the page is opened
renderUsers();
