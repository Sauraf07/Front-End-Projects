/* ===================================================== */
/* ================= GLOBAL UI CONTROLS ================= */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    handleNavbarScroll();
    pageFadeIn();
});

/* ===================================================== */
/* ================= NAVBAR SCROLL EFFECT =============== */
/* ===================================================== */

function handleNavbarScroll() {

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", function () {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });
}

/* ===================================================== */
/* ================= PAGE FADE ANIMATION ================ */
/* ===================================================== */

function pageFadeIn() {

    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease-in-out";

    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
}

/* ===================================================== */
/* ================= TOAST FUNCTION ===================== */
/* ===================================================== */

function showToast(message, type = "info", duration = 3000) {

    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "fadeOut 0.4s ease forwards";

        setTimeout(() => {
            toast.remove();
        }, 400);
    }, duration);
}

/* ===================================================== */
/* ================= BUTTON LOADING CONTROL ============ */
/* ===================================================== */

function startButtonLoading(button, text = "Processing...") {
    button.dataset.originalText = button.innerText;
    button.innerText = text;
    button.classList.add("btn-loading");
    button.disabled = true;
}

function stopButtonLoading(button) {
    button.innerText = button.dataset.originalText;
    button.classList.remove("btn-loading");
    button.disabled = false;
}

/* ===================================================== */
/* ================= SCROLL REVEAL LOGIC =============== */
/* ===================================================== */

function handleScrollReveal() {

    const reveals = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    const windowHeight = window.innerHeight;

    reveals.forEach(element => {

        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", handleScrollReveal);
window.addEventListener("load", handleScrollReveal);