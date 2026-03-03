/* ===================================================== */
/* ================= GLOBAL VARIABLES =================== */
/* ===================================================== */

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("contactName");
const emailInput = document.getElementById("contactEmail");
const subjectInput = document.getElementById("contactSubject");
const messageInput = document.getElementById("contactMessage");

/* ===================================================== */
/* ================= INITIAL LOAD ======================= */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    attachInputEffects();
});

/* ===================================================== */
/* ================= INPUT FOCUS EFFECT ================= */
/* ===================================================== */

function attachInputEffects() {

    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach(input => {

        input.addEventListener("focus", () => {
            input.style.borderColor = "#1e3c72";
            input.style.boxShadow = "0 0 5px rgba(30,60,114,0.4)";
        });

        input.addEventListener("blur", () => {
            input.style.borderColor = "#ccc";
            input.style.boxShadow = "none";
        });

    });
}

/* ===================================================== */
/* ================= FORM SUBMIT ======================== */
/* ===================================================== */

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    clearErrors();

    let isValid = true;

    if (!validateName(nameInput.value)) {
        showError(nameInput, "Name must be at least 3 characters.");
        isValid = false;
    }

    if (!validateEmail(emailInput.value)) {
        showError(emailInput, "Enter a valid email address.");
        isValid = false;
    }

    if (!validateSubject(subjectInput.value)) {
        showError(subjectInput, "Subject must be at least 5 characters.");
        isValid = false;
    }

    if (!validateMessage(messageInput.value)) {
        showError(messageInput, "Message must be at least 10 characters.");
        isValid = false;
    }

    if (!isValid) return;

    simulateSubmission();
});

/* ===================================================== */
/* ================= VALIDATION FUNCTIONS =============== */
/* ===================================================== */

function validateName(name) {
    return name.trim().length >= 3;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

function validateSubject(subject) {
    return subject.trim().length >= 5;
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

/* ===================================================== */
/* ================= ERROR HANDLING ===================== */
/* ===================================================== */

function showError(input, message) {

    const error = document.createElement("small");
    error.className = "error-message";
    error.style.color = "red";
    error.style.display = "block";
    error.style.marginTop = "5px";
    error.innerText = message;

    input.parentElement.appendChild(error);
}

function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach(error => error.remove());
}

/* ===================================================== */
/* ================= SIMULATE SUBMISSION ================ */
/* ===================================================== */

function simulateSubmission() {

    const button = contactForm.querySelector("button");
    button.innerText = "Sending...";
    button.disabled = true;

    setTimeout(() => {

        showSuccessMessage();

        contactForm.reset();
        button.innerText = "Send Message";
        button.disabled = false;

    }, 1500);
}

/* ===================================================== */
/* ================= SUCCESS MESSAGE ==================== */
/* ===================================================== */

function showSuccessMessage() {

    const successDiv = document.createElement("div");

    successDiv.style.marginTop = "15px";
    successDiv.style.padding = "10px";
    successDiv.style.background = "#d4edda";
    successDiv.style.color = "#155724";
    successDiv.style.borderRadius = "6px";
    successDiv.style.textAlign = "center";

    successDiv.innerText = "Your message has been sent successfully!";

    contactForm.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

/* ===================================================== */
/* ================= DEBUG MODE ========================= */
/* ===================================================== */

function debug(message) {
    if (window.location.hostname === "localhost") {
        console.log("[DEBUG]:", message);
    }
}