/* ===================================================== */
/* ================= GLOBAL VARIABLES =================== */
/* ===================================================== */

const seatGrid = document.getElementById("seatGrid");
const selectedSeatsDisplay = document.getElementById("selectedSeats");
const totalPriceDisplay = document.getElementById("totalPrice");
const continueBtn = document.getElementById("continueBtn");

let selectedSeats = [];
let bookedSeats = [];
let seatPrice = 0;

/* ===================================================== */
/* ================= INITIAL LOAD ======================= */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    loadBusDetails();
    generateSeats(40); // total seats
});

/* ===================================================== */
/* ================= LOAD BUS DETAILS =================== */
/* ===================================================== */

function loadBusDetails() {
    const bus = JSON.parse(localStorage.getItem("selectedBus"));

    if (!bus) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("busName").innerText = bus.name;
    document.getElementById("busType").innerText = bus.type;
    document.getElementById("departureTime").innerText = bus.departure;
    document.getElementById("arrivalTime").innerText = bus.arrival;
    document.getElementById("busPrice").innerText = `Price per seat: ₹${bus.price}`;

    seatPrice = bus.price;
}

/* ===================================================== */
/* ================= GENERATE SEATS ===================== */
/* ===================================================== */

function generateSeats(totalSeats) {

    seatGrid.innerHTML = "";

    // Random booked seats
    bookedSeats = generateRandomBookedSeats(totalSeats, 8);

    for (let i = 1; i <= totalSeats; i++) {

        const seat = document.createElement("div");
        seat.classList.add("seat");

        seat.dataset.seatNumber = i;

        if (bookedSeats.includes(i)) {
            seat.classList.add("booked");
        } else {
            seat.classList.add("available");
            seat.addEventListener("click", () => toggleSeat(seat));
        }

        seatGrid.appendChild(seat);
    }
}

/* ===================================================== */
/* ================= RANDOM BOOKED SEATS ================ */
/* ===================================================== */

function generateRandomBookedSeats(total, count) {
    let randomSeats = [];

    while (randomSeats.length < count) {
        let random = Math.floor(Math.random() * total) + 1;
        if (!randomSeats.includes(random)) {
            randomSeats.push(random);
        }
    }

    return randomSeats;
}

/* ===================================================== */
/* ================= TOGGLE SEAT ======================== */
/* ===================================================== */

function toggleSeat(seatElement) {

    const seatNumber = parseInt(seatElement.dataset.seatNumber);

    if (seatElement.classList.contains("selected")) {

        seatElement.classList.remove("selected");
        selectedSeats = selectedSeats.filter(num => num !== seatNumber);

    } else {

        seatElement.classList.add("selected");
        selectedSeats.push(seatNumber);
    }

    updateSummary();
}

/* ===================================================== */
/* ================= UPDATE SUMMARY ===================== */
/* ===================================================== */

function updateSummary() {

    if (selectedSeats.length === 0) {
        selectedSeatsDisplay.innerText = "None";
        totalPriceDisplay.innerText = "0";
        continueBtn.disabled = true;
        return;
    }

    selectedSeatsDisplay.innerText = selectedSeats.join(", ");

    const total = selectedSeats.length * seatPrice;
    totalPriceDisplay.innerText = total;

    continueBtn.disabled = false;
}

/* ===================================================== */
/* ================= CONTINUE BUTTON ==================== */
/* ===================================================== */

continueBtn.addEventListener("click", function () {

    if (selectedSeats.length === 0) return;

    const bookingData = {
        bus: JSON.parse(localStorage.getItem("selectedBus")),
        seats: selectedSeats,
        totalAmount: selectedSeats.length * seatPrice
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    window.location.href = "payment.html";
});

/* ===================================================== */
/* ================= FUTURE BACKEND STRUCTURE =========== */
/* ===================================================== */

// Future: Lock seat via API before confirmation
async function lockSeatAPI(seatNumber) {
    try {
        const response = await fetch("/api/lock-seat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seatNumber })
        });

        return await response.json();
    } catch (error) {
        console.error("Seat lock error:", error);
    }
}

/* ===================================================== */
/* ================= DEBUG MODE ========================= */
/* ===================================================== */

function debug(message) {
    if (window.location.hostname === "localhost") {
        console.log("[DEBUG]:", message);
    }
}