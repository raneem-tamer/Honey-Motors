const cars = [
    { id: 281, image: "static/images/toyota.jpg", make: "Toyota", model: "Camry", year: 2020, price: 25000.00, fuelType: "Petrol", mileage: 50000, location: "Cairo" },
    { id: 282, image: "static/images/ACR.jpg", make: "Honda", model: "Civic", year: 2019, price: 22000.00, fuelType: "Petrol", mileage: 40000, location: "Alexandria" },
    { id: 283, image: "static/images/ford gt.jpg", make: "Ford", model: "Focus", year: 2018, price: 18000.00, fuelType: "Diesel", mileage: 60000, location: "Giza" },
    { id: 284, image: "static/images/S600.jpg", make: "BMW", model: "X5", year: 2021, price: 50000.00, fuelType: "Diesel", mileage: 30000, location: "Luxor" },
    { id: 285, image: "static/images/hellcat.jpg", make: "Nissan", model: "Altima", year: 2021, price: 24000.00, fuelType: "Petrol", mileage: 45000, location: "Aswan" },
    { id: 286, image: "static/images/gtr.jpg", make: "Chevrolet", model: "Malibu", year: 2017, price: 17000.00, fuelType: "Diesel", mileage: 70000, location: "Suez" },
    { id: 287, image: "static/images/EB.jpg", make: "Mazda", model: "CX-5", year: 2020, price: 26000.00, fuelType: "Petrol", mileage: 35000, location: "Fayoum" },
    { id: 288, image: "static/images/amg one.jpg", make: "Hyundai", model: "Elantra", year: 2018, price: 15000.00, fuelType: "Petrol", mileage: 80000, location: "Tanta" },
    { id: 289, image: "static/images/BUGATTI.jpg", make: "Kia", model: "Sportage", year: 2019, price: 23000.00, fuelType: "Diesel", mileage: 60000, location: "Sharm El Sheikh" },
    { id: 290, image: "static/images/Forf gt.jpg", make: "Volkswagen", model: "Passat", year: 2022, price: 30000.00, fuelType: "Petrol", mileage: 20000, location: "Hurghada" },
    { id: 291, image: "static/images/Ford gt.jpg", make: "Mercedes-Benz", model: "C-Class", year: 2020, price: 55000.00, fuelType: "Petrol", mileage: 30000, location: "Asyut" },
    { id: 292, image: "static/images/FB_IMG_1595118102413.jpg", make: "Subaru", model: "Outback", year: 2018, price: 19000.00, fuelType: "Diesel", mileage: 65000, location: "Ismailia" },
    { id: 293, image: "static/images/Pagani.jpg", make: "Jeep", model: "Grand Cherokee", year: 2021, price: 45000.00, fuelType: "Petrol", mileage: 40000, location: "Dahab" },
    { id: 294, image: "static/images/AMG GT.jpg", make: "Tesla", model: "Model 3", year: 2023, price: 60000.00, fuelType: "Electric", mileage: 10000, location: "Alexandria" },
    { id: 295, image: "static/images/AMG GT3.jpg", make: "Jaguar", model: "F-Pace", year: 2019, price: 40000.00, fuelType: "Diesel", mileage: 55000, location: "Port Said" },
    { id: 296, image: "static/images/911 GT3 RS.jpg", make: "Land Rover", model: "Range Rover", year: 2021, price: 75000.00, fuelType: "Diesel", mileage: 25000, location: "Giza" },
    { id: 297, image: "static/images/amg one.jpg", make: "Porsche", model: "911", year: 2022, price: 80000.00, fuelType: "Petrol", mileage: 15000, location: "Zagazig" },
];

alert("لا ياصاحبي مفيش عروض ولا حاجه");
alert("و النبي نجحني يا دكتور");

const carGrid = document.getElementById('carGrid');
const searchInput = document.getElementById('searchInput');
const makeFilter = document.getElementById('makeFilter');
const priceFilter = document.getElementById('priceFilter');
const yearFilter = document.getElementById('yearFilter');
const fuelFilter = document.getElementById('fuelFilter');
const locationFilter = document.getElementById('locationFilter');

// Compare Modal Elements
const compareModal = document.getElementById('compareModal');
const compareBtn = document.getElementById('compareBtn');
const closeCompareModal = document.getElementById('closeCompareModal');
const car1Select = document.getElementById('car1Select');
const car2Select = document.getElementById('car2Select');
const compareAction = document.getElementById('compareAction');
const car1DetailsDiv = document.getElementById('car1Details');
const car2DetailsDiv = document.getElementById('car2Details');

// Build Your Car Modal Elements
const buildCarBtn = document.getElementById('buildCarBtn');
const buildCarModal = document.getElementById('buildCarModal');
const closeBuildCarModal = document.getElementById('closeBuildCarModal');
const buildAction = document.getElementById('buildAction');
const cylindersInput = document.getElementById('cylinders');
const engineCapacityInput = document.getElementById('engineCapacity');
const tireTypeInput = document.getElementById('tireType');
const baseCarSelect = document.getElementById('baseCar');

// Sell Your Car Modal Elements
const sellCarBtn = document.getElementById('sellCarBtn');
const sellCarModal = document.getElementById('sellCarModal');
const closeSellCarModal = document.getElementById('closeSellCarModal');
const sellAction = document.getElementById('sellAction');
const sellCarNameInput = document.getElementById('sellCarName');
const sellCarModelInput = document.getElementById('sellCarModel');
const sellCarYearInput = document.getElementById('sellCarYear');

function displayCars(filteredCars) {
    carGrid.innerHTML = ''; // Clear previous results

    const carCards = filteredCars.map(car => {
        return `
            <div class="car-card">
                <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                <div class="car-info">
                    <img src="${car.image}" alt="${car.make} ${car.model}">
                    <h3>${car.make} ${car.model}</h3>
                    <p>Year: ${car.year}</p>
                    <p>Price: $${car.price.toLocaleString()}</p>
                    <p>Fuel Type: ${car.fuelType}</p>
                    <p>Location: ${car.location}</p>
                </div>
            </div>
        `;
    }).join('');

    carGrid.innerHTML = carCards; // Add all cards at once
}

function filterCars() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedMake = makeFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedYear = yearFilter.value;
    const selectedFuel = fuelFilter.value;
    const selectedLocation = locationFilter.value;

    const filteredCars = cars.filter(car => {
        const matchesSearch =
            car.make.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm);

        const matchesMake = selectedMake === "" || car.make === selectedMake;
        const matchesPrice = selectedPrice === "" || (
            selectedPrice.includes("+") ? car.price >= Number(selectedPrice.replace("+", "")) :
            (car.price >= Number(selectedPrice.split("-")[0]) && car.price <= Number(selectedPrice.split("-")[1]))
        );
        const matchesYear = selectedYear === "" || car.year.toString() === selectedYear;
        const matchesFuel = selectedFuel === "" || car.fuelType === selectedFuel;
        const matchesLocation = selectedLocation === "" || car.location === selectedLocation;

        return matchesSearch && matchesMake && matchesPrice && matchesYear && matchesFuel && matchesLocation;
    });

    displayCars(filteredCars);
}

// Show car details (popup or expanded section on the same page)
function showDetails(carId) {
    const car = cars.find(car => car.id === carId);
    if (car) {
        alert(`Details for ${car.make} ${car.model}:
        Year: ${car.year}
        Price: $${car.price.toLocaleString()}
        Fuel Type: ${car.fuelType}
        Mileage: ${car.mileage} km
        Location: ${car.location}`);
    }
}

searchInput.addEventListener('input', filterCars);
makeFilter.addEventListener('change', filterCars);
priceFilter.addEventListener('change', filterCars);
yearFilter.addEventListener('change', filterCars);
fuelFilter.addEventListener('change', filterCars);
locationFilter.addEventListener('change', filterCars);

function toggleFavorite(button) {
    button.classList.toggle('active');
    button.innerHTML = button.classList.contains('active') ? '♥' : '♡';
}

const questionsAndAnswers = [
    { question: "Hello! How can I help you today?", answer: "I can assist you with our products or services. Please ask any questions." },
    { question: "What kind of product are you looking for?", answer: "We have a variety of products. You can choose from cars, electronics, etc." },
    { question: "Do you have a specific product in mind?", answer: "Please tell me the product name or category." },
];

function toggleChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = (chatWindow.style.display === 'none' || chatWindow.style.display === '') ? 'flex' : 'none';

    if (chatWindow.style.display === 'flex' && document.getElementById('chatBody').children.length === 0) {
        startConversation();
    }
}

function startConversation() {
    const chatBody = document.getElementById('chatBody');
    questionsAndAnswers.forEach((qa, index) => {
        const questionElem = document.createElement("p");
        questionElem.textContent = qa.question;
        questionElem.classList.add('question');
        questionElem.addEventListener('click', () => displayAnswer(index));

        const answerElem = document.createElement("p");
        answerElem.textContent = qa.answer;
        answerElem.classList.add('answer');
        answerElem.style.display = 'none'; // Initially hidden

        chatBody.appendChild(questionElem);
        chatBody.appendChild(answerElem);
    });
}

function displayAnswer(index) {
    const answers = document.querySelectorAll('.answer');
    answers[index].style.display = answers[index].style.display === 'none' ? 'block' : 'none';
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    const userMessage = chatInput.value.trim();

    if (userMessage !== "") {
        displayMessage(userMessage, 'user');
        chatInput.value = "";
    }
}

function displayMessage(message, sender) {
    const chatBody = document.getElementById('chatBody');
    const messageElem = document.createElement("p");
    messageElem.textContent = message;
    messageElem.classList.add(sender);
    chatBody.appendChild(messageElem);
    chatBody.scrollTop = chatBody.scrollHeight;
}

document.getElementById('chatInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }

});

// Compare Cars Functionality
compareBtn.addEventListener('click', () => {
    compareModal.style.display = "block";
    populateCarOptions();
});

closeCompareModal.addEventListener('click', () => {
    compareModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === compareModal) {
        compareModal.style.display = "none";
    }
});

function populateCarOptions() {
    // Clear existing options
    car1Select.innerHTML = '<option value="">Select Car 1</option>';
    car2Select.innerHTML = '<option value="">Select Car 2</option>';

    cars.forEach(car => {
        const option1 = document.createElement('option');
        option1.value = car.id;
        option1.textContent = `${car.make} ${car.model}`;  // Corrected here
        car1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = car.id;
        option2.textContent = `${car.make} ${car.model}`;  // Corrected here
        car2Select.appendChild(option2);
    });
}

compareAction.addEventListener('click', () => {
    const carId1 = parseInt(car1Select.value);
    const carId2 = parseInt(car2Select.value);

    if (carId1 && carId2 && carId1 !== carId2) {
        const car1 = cars.find(car => car.id === carId1);
        const car2 = cars.find(car => car.id === carId2);
        displayComparison(car1, car2);
    } else {
        alert("Please select two different cars to compare.");
    }
});

function displayComparison(car1, car2) {
    car1DetailsDiv.innerHTML = `
        <h4>${car1.make} ${car1.model}</h4>
        <img src="${car1.image}" alt="${car1.make} ${car1.model}" style="width: 100%;">
        <p>Year: ${car1.year}</p>
        <p>Price: $${car1.price.toLocaleString()}</p>
        <p>Fuel Type: ${car1.fuelType}</p>
        <p>Mileage: ${car1.mileage} km</p>
        <p>Location: ${car1.location}</p>
    `;

    car2DetailsDiv.innerHTML = `
        <h4>${car2.make} ${car2.model}</h4>
        <img src="${car2.image}" alt="${car2.make} ${car2.model}" style="width: 100%;">
        <p>Year: ${car2.year}</p>
        <p>Price: $${car2.price.toLocaleString()}</p>
        <p>Fuel Type: ${car2.fuelType}</p>
        <p>Mileage: ${car2.mileage} km</p>
        <p>Location: ${car2.location}</p>
    `;
}

// Build Your Car Functionality
buildCarBtn.addEventListener('click', () => {
    buildCarModal.style.display = "block";
});

closeBuildCarModal.addEventListener('click', () => {
    buildCarModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === buildCarModal) {
        buildCarModal.style.display = "none";
    }
});

buildAction.addEventListener('click', () => {
    alert("لن نعمل علي هذا العبث ابدا");
    buildCarModal.style.display = "none";
});

// Sell Your Car Functionality
sellCarBtn.addEventListener('click', () => {
    sellCarModal.style.display = "block";
});

closeSellCarModal.addEventListener('click', () => {
    sellCarModal.style.display = "none";
});

window.addEventListener('click', (event) => {
     if (event.target === sellCarModal) {
        sellCarModal.style.display = "none";
    }
});

sellAction.addEventListener('click', () => {
    const carName = sellCarNameInput.value.trim();
    const carModel = sellCarModelInput.value.trim();
    const carYear = sellCarYearInput.value.trim();

        if (!carName || !carModel || !carYear) {
        alert("Please fill in all car details.");
        return;
    }
    alert("روح بيعها هنا https://eg.hatla2ee.com/ متقرفناش معاك");
    sellCarModal.style.display = "none";
});





// Initial display of all cars
displayCars(cars);
