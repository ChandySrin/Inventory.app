/* ========================
   Authentication JS - Login Logic
======================== */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    initUsers();
    loadRememberedEmail();

    loginForm.addEventListener('submit', handleLogin);
});

/* ========================
   Functions
======================== */

function initUsers() {
    if (localStorage.getItem('users')) return;

    const users = [
        {
            id: '1',
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'password123',
            role: 'Admin',
            status: 'Active',
            joined: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Manager User',
            email: 'manager@test.com',
            password: 'password123',
            role: 'Manager',
            status: 'Active',
            joined: new Date().toISOString()
        }
    ];

    localStorage.setItem('users', JSON.stringify(users));
}

function handleLogin(e) {
    e.preventDefault();

    clearAlert();

    const email = getInput('email').value.trim();
    const password = getInput('password').value;
    const rememberMe = getInput('rememberMe').checked;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showAlert('Invalid email or password. Try admin@test.com / password123');
        getInput('password').value = '';
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));

    if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
    } else {
        localStorage.removeItem('rememberEmail');
    }

    window.location.href = 'dashboard.html';
}

function loadRememberedEmail() {
    const email = localStorage.getItem('rememberEmail');
    if (!email) return;

    getInput('email').value = email;
    getInput('rememberMe').checked = true;
}

function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger mt-3';
    alert.id = 'loginAlert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.querySelector('.right-side').prepend(alert);
}

function clearAlert() {
    const alert = document.getElementById('loginAlert');
    if (alert) alert.remove();
}

function getInput(id) {
    return document.getElementById(id);
}
/* ========================
   Dashboard JS - Inventory Management
======================== */
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');

  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';

    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
  });
});
