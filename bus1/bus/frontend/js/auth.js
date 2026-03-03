/* ===================================================== */
/* ================= APPLICATION CONFIG ================= */
/* ===================================================== */

const AUTH_CONFIG = {
    usersKey: "busbook_users",
    currentUserKey: "busbook_current_user",
    sessionTimeout: 60 * 60 * 1000, // 1 hour
    minPasswordLength: 6,
    version: "2.0.0"
};

/* ===================================================== */
/* ================= GLOBAL ELEMENTS ==================== */
/* ===================================================== */

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

/* ===================================================== */
/* ================= INITIALIZATION ===================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    restoreSession();
    attachEventListeners();
});

/* ===================================================== */
/* ================= EVENT LISTENERS ==================== */
/* ===================================================== */

function attachEventListeners() {

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
}

/* ===================================================== */
/* ================= SESSION RESTORE ==================== */
/* ===================================================== */

function restoreSession() {

    const stored = localStorage.getItem(AUTH_CONFIG.currentUserKey);
    if (!stored) return;

    const session = JSON.parse(stored);

    if (Date.now() > session.expiry) {
        logout();
        return;
    }

    debugLog("Session Restored for " + session.user.email);
}

/* ===================================================== */
/* ================= REGISTER HANDLER =================== */
/* ===================================================== */

function handleRegister(e) {

    e.preventDefault();
    clearErrors();

    const name = getValue("regName");
    const email = getValue("regEmail");
    const password = getValue("regPassword");
    const confirmPassword = getValue("regConfirmPassword");

    if (!validateRegistration(name, email, password, confirmPassword)) {
        showToast("Please fix errors before continuing.", "error");
        return;
    }

    createUser(name, email, password);
}

/* ===================================================== */
/* ================= LOGIN HANDLER ====================== */
/* ===================================================== */

function handleLogin(e) {

    e.preventDefault();
    clearErrors();

    const email = getValue("loginEmail");
    const password = getValue("loginPassword");

    if (!validateLogin(email, password)) {
        showToast("Invalid credentials format.", "error");
        return;
    }

    authenticateUser(email, password);
}

/* ===================================================== */
/* ================= USER CREATION ====================== */
/* ===================================================== */

function createUser(name, email, password) {

    let users = getUsers();

    if (users.some(u => u.email === email)) {
        showError("regEmail", "Email already registered.");
        return;
    }

    const user = {
        id: generateUserId(),
        name,
        email,
        password: hashPassword(password),
        role: "user",
        createdAt: new Date().toISOString(),
        lastLogin: null,
        loginCount: 0
    };

    users.push(user);
    saveUsers(users);

    showToast("Registration successful!", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);
}

/* ===================================================== */
/* ================= USER AUTH ========================== */
/* ===================================================== */

function authenticateUser(email, password) {

    const users = getUsers();
    const hashed = hashPassword(password);

    const user = users.find(u => u.email === email && u.password === hashed);

    if (!user) {
        showError("loginPassword", "Invalid email or password.");
        return;
    }

    user.lastLogin = new Date().toISOString();
    user.loginCount += 1;

    saveUsers(users);
    createSession(user);

    showToast("Login successful!", "success");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
}

/* ===================================================== */
/* ================= SESSION MANAGEMENT ================= */
/* ===================================================== */

function createSession(user) {

    const session = {
        user,
        loginTime: Date.now(),
        expiry: Date.now() + AUTH_CONFIG.sessionTimeout
    };

    localStorage.setItem(
        AUTH_CONFIG.currentUserKey,
        JSON.stringify(session)
    );
}

function logout() {
    localStorage.removeItem(AUTH_CONFIG.currentUserKey);
    showToast("Logged out successfully.", "info");
}

/* ===================================================== */
/* ================= PROTECTED ROUTE HELPER ============= */
/* ===================================================== */

function requireAuth() {

    const session =
        JSON.parse(localStorage.getItem(AUTH_CONFIG.currentUserKey));

    if (!session) {
        showToast("Please login to continue.", "error");
        setTimeout(() => window.location.href = "login.html", 1200);
        return false;
    }

    return true;
}

/* ===================================================== */
/* ================= VALIDATION ========================= */
/* ===================================================== */

function validateRegistration(name, email, password, confirmPassword) {

    let valid = true;

    if (name.length < 3) {
        showError("regName", "Minimum 3 characters required.");
        valid = false;
    }

    if (!validateEmail(email)) {
        showError("regEmail", "Invalid email format.");
        valid = false;
    }

    if (!validatePassword(password)) {
        showError("regPassword", "Weak password.");
        valid = false;
    }

    if (password !== confirmPassword) {
        showError("regConfirmPassword", "Passwords do not match.");
        valid = false;
    }

    return valid;
}

function validateLogin(email, password) {
    return validateEmail(email) && password.length >= AUTH_CONFIG.minPasswordLength;
}

/* ===================================================== */
/* ================= PASSWORD STRENGTH ================== */
/* ===================================================== */

function validatePassword(password) {
    const strongRegex =
        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    return strongRegex.test(password);
}

/* ===================================================== */
/* ================= UTILITIES ========================== */
/* ===================================================== */

function getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey)) || [];
}

function saveUsers(users) {
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
}

function generateUserId() {
    return "USR" + Date.now();
}

function hashPassword(password) {
    return btoa(password); // basic frontend encoding (simulation only)
}

function getValue(id) {
    return document.getElementById(id)?.value.trim();
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ===================================================== */
/* ================= ERROR HANDLING ===================== */
/* ===================================================== */

function showError(fieldId, message) {

    const field = document.getElementById(fieldId);
    if (!field) return;

    const error = document.createElement("small");
    error.className = "error-message";
    error.innerText = message;

    field.parentElement.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach(e => e.remove());
}

/* ===================================================== */
/* ================= DEBUG ============================== */
/* ===================================================== */

function debugLog(message) {
    if (window.location.hostname === "localhost") {
        console.log("[AUTH DEBUG]:", message);
    }
}