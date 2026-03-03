/* ===================================================== */
/* ================= GLOBAL VARIABLES =================== */
/* ===================================================== */

const searchForm = document.getElementById("searchForm");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const dateInput = document.getElementById("date");

/* ===================================================== */
/* ================= INIT FUNCTION ====================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initializeDate();
    attachInputEffects();
    loadPreviousSearch();
});

/* ===================================================== */
/* ================= DATE INITIALIZATION ================ */
/* ===================================================== */

function initializeDate() {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
}

/* ===================================================== */
/* ================= LOAD PREVIOUS SEARCH =============== */
/* ===================================================== */

function loadPreviousSearch() {
    const from = localStorage.getItem("from");
    const to = localStorage.getItem("to");
    const date = localStorage.getItem("date");

    if (from) fromInput.value = from;
    if (to) toInput.value = to;
    if (date) dateInput.value = date;
}

/* ===================================================== */
/* ================= INPUT ANIMATION ==================== */
/* ===================================================== */

function attachInputEffects() {
    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.borderColor = "#1e3c72";
            input.style.boxShadow = "0 0 5px rgba(30,60,114,0.5)";
        });

        input.addEventListener("blur", () => {
            input.style.borderColor = "#ccc";
            input.style.boxShadow = "none";
        });
    });
}

/* ===================================================== */
/* ================= FORM VALIDATION ==================== */
/* ===================================================== */

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    clearErrors();

    let isValid = true;

    if (!validateCity(fromInput.value)) {
        showError(fromInput, "Please enter valid departure city.");
        isValid = false;
    }

    if (!validateCity(toInput.value)) {
        showError(toInput, "Please enter valid destination city.");
        isValid = false;
    }

    if (fromInput.value === toInput.value) {
        showError(toInput, "Departure and destination cannot be same.");
        isValid = false;
    }

    if (!dateInput.value) {
        showError(dateInput, "Please select travel date.");
        isValid = false;
    }

    if (!isValid) return;

    saveSearchData();
    redirectToListing();
});

/* ===================================================== */
/* ================= CITY VALIDATION ==================== */
/* ===================================================== */

function validateCity(city) {
    const cityRegex = /^[a-zA-Z\s]{3,}$/;
    return cityRegex.test(city.trim());
}

/* ===================================================== */
/* ================= SHOW ERROR ========================= */
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

/* ===================================================== */
/* ================= CLEAR ERRORS ======================= */
/* ===================================================== */

function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach(error => error.remove());
}

/* ===================================================== */
/* ================= SAVE DATA ========================== */
/* ===================================================== */

function saveSearchData() {
    localStorage.setItem("from", fromInput.value.trim());
    localStorage.setItem("to", toInput.value.trim());
    localStorage.setItem("date", dateInput.value);
}

/* ===================================================== */
/* ================= REDIRECT =========================== */
/* ===================================================== */

function redirectToListing() {
    animateButton();
    setTimeout(() => {
        window.location.href = "bus-listing.html";
    }, 500);
}

/* ===================================================== */
/* ================= BUTTON ANIMATION =================== */
/* ===================================================== */

function animateButton() {
    const btn = document.querySelector(".btn-search");
    btn.innerHTML = "Searching...";
    btn.style.opacity = "0.7";
}

/* ===================================================== */
/* ================= SWAP CITY FEATURE ================== */
/* ===================================================== */

createSwapButton();

function createSwapButton() {
    const swapBtn = document.createElement("button");
    swapBtn.innerHTML = "⇄";
    swapBtn.type = "button";
    swapBtn.style.margin = "10px";
    swapBtn.style.padding = "8px";
    swapBtn.style.cursor = "pointer";

    const form = document.querySelector("#searchForm");
    form.insertBefore(swapBtn, form.children[2]);

    swapBtn.addEventListener("click", () => {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
    });
}

/* ===================================================== */
/* ================= AUTO CAPITALIZE ==================== */
/* ===================================================== */

fromInput.addEventListener("input", autoCapitalize);
toInput.addEventListener("input", autoCapitalize);

function autoCapitalize(e) {
    e.target.value = e.target.value
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

/* ===================================================== */
/* ================= FUTURE API STRUCTURE =============== */
/* ===================================================== */

// This function will be used later for backend integration
async function fetchBusData(query) {
    try {
        const response = await fetch("/api/buses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
        });

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
    }
}

/* ===================================================== */
/* ================= DEBUG LOGGER ======================= */
/* ===================================================== */

function debugLog(message) {
    if (window.location.hostname === "localhost") {
        console.log("[DEBUG]:", message);
    }
}