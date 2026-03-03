/* ===================================================== */
/* ================= GLOBAL VARIABLES =================== */
/* ===================================================== */

const busContainer = document.getElementById("busContainer");
const routeTitle = document.getElementById("routeTitle");
const travelDate = document.getElementById("travelDate");
const sortSelect = document.getElementById("sortSelect");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

/* ===================================================== */
/* ================= SAMPLE BUS DATA ==================== */
/* ===================================================== */

let buses = [
    {
        id: 1,
        name: "Express Travels",
        type: "AC Sleeper",
        departure: "18:00",
        arrival: "06:00",
        duration: "12h",
        price: 1200,
        seats: 12
    },
    {
        id: 2,
        name: "Royal Journey",
        type: "Non-AC Seater",
        departure: "20:00",
        arrival: "08:00",
        duration: "12h",
        price: 800,
        seats: 20
    },
    {
        id: 3,
        name: "GreenLine Travels",
        type: "AC Seater",
        departure: "10:00",
        arrival: "20:00",
        duration: "10h",
        price: 1000,
        seats: 5
    }
];

let filteredBuses = [...buses];

/* ===================================================== */
/* ================= INITIAL LOAD ======================= */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    loadRouteInfo();
    renderBuses(filteredBuses);
});

/* ===================================================== */
/* ================= LOAD ROUTE INFO ==================== */
/* ===================================================== */

function loadRouteInfo() {
    const from = localStorage.getItem("from") || "City A";
    const to = localStorage.getItem("to") || "City B";
    const date = localStorage.getItem("date") || "Not Selected";

    routeTitle.innerText = `${from} → ${to}`;
    travelDate.innerText = `Date: ${date}`;
}

/* ===================================================== */
/* ================= RENDER BUS CARDS =================== */
/* ===================================================== */

function renderBuses(busList) {

    busContainer.innerHTML = "";

    if (busList.length === 0) {
        busContainer.innerHTML = `
            <div class="no-results">
                No buses found for selected filters.
            </div>
        `;
        return;
    }

    busList.forEach(bus => {

        const card = document.createElement("div");
        card.classList.add("bus-card");

        card.innerHTML = `
            <div class="bus-left">
                <h3>${bus.name}</h3>
                <p>${bus.type}</p>
                <div class="timing">
                    <span>${bus.departure}</span>
                    <span>→</span>
                    <span>${bus.arrival}</span>
                </div>
                <p>Duration: ${bus.duration}</p>
            </div>

            <div class="bus-middle">
                <p class="price">₹${bus.price}</p>
                <p>Seats Available: ${bus.seats}</p>
            </div>

            <div class="bus-right">
                <button class="btn-select" onclick="selectBus(${bus.id})">
                    Select Seat
                </button>
            </div>
        `;

        busContainer.appendChild(card);
    });
}

/* ===================================================== */
/* ================= SORT FUNCTION ====================== */
/* ===================================================== */

sortSelect.addEventListener("change", function () {

    const value = sortSelect.value;

    if (value === "priceLow") {
        filteredBuses.sort((a, b) => a.price - b.price);
    }
    else if (value === "priceHigh") {
        filteredBuses.sort((a, b) => b.price - a.price);
    }
    else if (value === "departure") {
        filteredBuses.sort((a, b) =>
            a.departure.localeCompare(b.departure)
        );
    }

    renderBuses(filteredBuses);
});

/* ===================================================== */
/* ================= PRICE FILTER ======================= */
/* ===================================================== */

priceRange.addEventListener("input", function () {

    priceValue.innerText = priceRange.value;

    filteredBuses = buses.filter(bus =>
        bus.price <= priceRange.value
    );

    renderBuses(filteredBuses);
});

/* ===================================================== */
/* ================= TYPE FILTER ======================== */
/* ===================================================== */

const checkboxes = document.querySelectorAll(".filters input[type='checkbox']");

checkboxes.forEach(box => {
    box.addEventListener("change", applyFilters);
});

function applyFilters() {

    const selectedTypes = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    filteredBuses = buses.filter(bus => {

        if (selectedTypes.length === 0) return true;

        return selectedTypes.some(type =>
            bus.type.includes(type)
        );
    });

    renderBuses(filteredBuses);
}

/* ===================================================== */
/* ================= SELECT BUS ========================= */
/* ===================================================== */

function selectBus(busId) {

    const selectedBus = buses.find(bus => bus.id === busId);

    localStorage.setItem("selectedBus", JSON.stringify(selectedBus));

    window.location.href = "seat-selection.html";
}

/* ===================================================== */
/* ================= FUTURE API STRUCTURE =============== */
/* ===================================================== */

// Future backend integration
async function fetchBusFromAPI() {
    try {
        const response = await fetch("/api/buses");
        const data = await response.json();
        buses = data;
        filteredBuses = [...buses];
        renderBuses(filteredBuses);
    } catch (error) {
        console.error("API Error:", error);
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