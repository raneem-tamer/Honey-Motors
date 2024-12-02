// Modal for Forgot Password
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeModal = document.getElementById('closeModal');

forgotPasswordLink.addEventListener('click', function () {
    forgotPasswordModal.style.display = 'block';
});

closeModal.addEventListener('click', function () {
    forgotPasswordModal.style.display = 'none';
});

window.onclick = function (event) {
    if (event.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
    }
};
