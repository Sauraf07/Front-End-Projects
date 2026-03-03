/* ===================================================== */
/* ================= GLOBAL CONFIG ====================== */
/* ===================================================== */

const APP_CONFIG = {
    gstRate: 0.05,
    currency: "Rs.",
    companyName: "BusBook",
    supportEmail: "support@busbook.com",
    version: "2.0.0"
};

/* ===================================================== */
/* ================= DOM REFERENCES ===================== */
/* ===================================================== */

const summaryBus = document.getElementById("summaryBus");
const summarySeats = document.getElementById("summarySeats");
const summaryAmount = document.getElementById("summaryAmount");

const paymentForm = document.getElementById("paymentForm");
const successBox = document.getElementById("successBox");
const downloadBtn = document.getElementById("downloadTicket");

let bookingData = null;
let bookingReference = null;

/* ===================================================== */
/* ================= INITIALIZATION ===================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initializePayment();
});

function initializePayment() {
    loadBookingSummary();
    attachFormListener();
}

/* ===================================================== */
/* ================= LOAD BOOKING ======================= */
/* ===================================================== */

function loadBookingSummary() {

    const storedData = localStorage.getItem("bookingData");

    if (!storedData) {
        showToast("No booking session found!", "error");
        setTimeout(() => window.location.href = "index.html", 1500);
        return;
    }

    bookingData = JSON.parse(storedData);

    summaryBus.innerText =
        `Bus: ${bookingData.bus.name} (${bookingData.bus.type})`;

    summarySeats.innerText =
        `Seats: ${bookingData.seats.join(", ")}`;

    summaryAmount.innerText =
        `Total Amount: ${APP_CONFIG.currency} ${bookingData.totalAmount}`;
}

/* ===================================================== */
/* ================= FORM HANDLING ====================== */
/* ===================================================== */

function attachFormListener() {
    paymentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        processPayment();
    });
}

function processPayment() {

    clearErrors();

    const passenger = {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        method: document.getElementById("paymentMethod").value,
        bookingTime: new Date().toLocaleString()
    };

    if (!validatePassenger(passenger)) return;

    bookingData.passenger = passenger;

    simulatePayment();
}

/* ===================================================== */
/* ================= VALIDATION ========================= */
/* ===================================================== */

function validatePassenger(p) {

    let valid = true;

    if (p.name.length < 3) {
        showError("fullName", "Minimum 3 characters required");
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        showError("email", "Invalid email format");
        valid = false;
    }

    if (!/^[0-9]{10}$/.test(p.phone)) {
        showError("phone", "Invalid 10-digit number");
        valid = false;
    }

    if (!p.method) {
        showError("paymentMethod", "Select payment method");
        valid = false;
    }

    return valid;
}

/* ===================================================== */
/* ================= PAYMENT SIMULATION ================= */
/* ===================================================== */

function simulatePayment() {

    const btn = document.querySelector(".btn-pay");
    startButtonLoading(btn, "Processing...");

    showToast("Authorizing payment...", "info");

    setTimeout(() => {
        completePayment(btn);
    }, 2000);
}

/* ===================================================== */
/* ================= COMPLETE PAYMENT =================== */
/* ===================================================== */

function completePayment(btn) {

    stopButtonLoading(btn);

    generateTicketID();
    generateReference();
    storeHistory();

    paymentForm.style.display = "none";
    successBox.style.display = "block";

    updateSuccessCard();
    generateQRCode();

    showToast("Payment Successful!", "success");
}

/* ===================================================== */
/* ================= ID GENERATION ====================== */
/* ===================================================== */

function generateTicketID() {
    bookingData.ticketID = "BB" + Date.now();
}

function generateReference() {
    bookingReference = "REF" + Math.floor(Math.random() * 999999999);
}

/* ===================================================== */
/* ================= UPDATE SUCCESS UI ================== */
/* ===================================================== */

function updateSuccessCard() {

    document.getElementById("ticketIdText").innerText =
        bookingData.ticketID;

    document.getElementById("busText").innerText =
        bookingData.bus.name;

    document.getElementById("seatText").innerText =
        bookingData.seats.join(", ");

    document.getElementById("totalText").innerText =
        APP_CONFIG.currency + " " + bookingData.totalAmount;
}

/* ===================================================== */
/* ================= STORE HISTORY ====================== */
/* ===================================================== */

function storeHistory() {

    let history =
        JSON.parse(localStorage.getItem("bookingHistory")) || [];

    history.push({
        ...bookingData,
        reference: bookingReference
    });

    localStorage.setItem("bookingHistory",
        JSON.stringify(history));
}

/* ===================================================== */
/* ================= QR CODE ============================ */
/* ===================================================== */

function generateQRCode() {

    const qrDiv = document.getElementById("qrCode");
    if (!qrDiv) return;

    qrDiv.innerHTML = "";

    new QRCode(qrDiv, {
        text: `Ticket:${bookingData.ticketID}|Ref:${bookingReference}|Seats:${bookingData.seats.join(",")}`,
        width: 120,
        height: 120
    });
}

/* ===================================================== */
/* ================= PDF GENERATION ===================== */
/* ===================================================== */

downloadBtn.addEventListener("click", generatePDF);

function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const gst =
        bookingData.totalAmount * APP_CONFIG.gstRate;

    const baseFare =
        bookingData.totalAmount - gst;

    /* HEADER */
    doc.setFillColor(30, 60, 114);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("BusBook Official E-Ticket", 50, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let y = 45;

    doc.text(`Ticket ID: ${bookingData.ticketID}`, 20, y); y += 8;
    doc.text(`Reference: ${bookingReference}`, 20, y); y += 8;
    doc.text(`Passenger: ${bookingData.passenger.name}`, 20, y); y += 8;
    doc.text(`Bus: ${bookingData.bus.name}`, 20, y); y += 8;
    doc.text(`Seats: ${bookingData.seats.join(", ")}`, 20, y); y += 8;

    y += 5;

    doc.text(`Base Fare: ${APP_CONFIG.currency} ${baseFare.toFixed(2)}`, 20, y); y += 8;
    doc.text(`GST (5%): ${APP_CONFIG.currency} ${gst.toFixed(2)}`, 20, y); y += 8;
    doc.text(`Total Paid: ${APP_CONFIG.currency} ${bookingData.totalAmount}`, 20, y);

    y += 20;

    doc.setFontSize(9);
    doc.text("This is a system generated ticket.", 20, 280);
    doc.text(`Support: ${APP_CONFIG.supportEmail}`, 130, 280);

    doc.save("BusBook_Official_Ticket.pdf");

    showToast("PDF Downloaded Successfully!", "success");
}

/* ===================================================== */
/* ================= UI UTILITIES ======================= */
/* ===================================================== */

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement("small");
    error.className = "error-message";
    error.style.color = "red";
    error.innerText = message;
    field.parentElement.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll(".error-message")
        .forEach(e => e.remove());
}

function startButtonLoading(btn, text) {
    btn.disabled = true;
    btn.innerText = text;
}

function stopButtonLoading(btn) {
    btn.disabled = false;
    btn.innerText = "Pay Now";
}

function showToast(message, type) {

    const container =
        document.getElementById("toastContainer");

    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    toast.style.padding = "10px 15px";
    toast.style.margin = "10px";
    toast.style.background = type === "success"
        ? "#28a745"
        : type === "error"
            ? "#dc3545"
            : "#007bff";
    toast.style.color = "#fff";
    toast.style.borderRadius = "5px";

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}