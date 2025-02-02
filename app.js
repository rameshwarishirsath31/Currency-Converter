const API_KEY = "6fbedc04486b5d6688605f8b"; // Replace with your actual API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

const country_sec = document.querySelectorAll(".country-selection select");
const exchange_btn = document.querySelector(".exchange-btn button"); // Fixed button selector
const from_sec = document.querySelector(".from select");
const to_sec = document.querySelector(".to select");
const exchange_rate_msg = document.querySelector(".exchange-rate p");

// Populate currency options dynamically
for (let select of country_sec) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Fetch exchange rates and update UI
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amt-sec input");
    let amtVal = amount.value;
    
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        const response = await fetch(`${BASE_URL}/${from_sec.value}`);
        const data = await response.json();

        if (data.result === "error") {
            exchange_rate_msg.innerText = "Error fetching rates! Try again.";
            return;
        }

        let rate = data.conversion_rates[to_sec.value];
        let finalAmount = (amtVal * rate).toFixed(2);
        exchange_rate_msg.innerText = `${amtVal} ${from_sec.value} = ${finalAmount} ${to_sec.value}`;
    } catch (error) {
        exchange_rate_msg.innerText = "Failed to fetch exchange rate!";
        console.error("API Fetch Error:", error);
    }
};

// Update flag on country selection change
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Event Listeners
exchange_btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
