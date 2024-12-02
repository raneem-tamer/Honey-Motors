const cars = [
    { image: "static/images/toyota.jpg", make: "Toyota", model: "Camry", year: 2022, price: 25000, fuelType: "Gasoline", carType: "Sedan" },
    { image: "static/images/Pagani.jpg", make: "Honda", model: "Civic", year: 2023, price: 22000, fuelType: "Hybrid", carType: "Sedan" },
    { image: "static/images/S600.jpg", make: "Ford", model: "Mustang", year: 2021, price: 35000, fuelType: "Gasoline", carType: "4x4" },
    { image: "static/images/Ford gt.jpg", make: "Toyota", model: "Rav4", year: 2023, price: 28000, fuelType: "Electric", carType: "SUV" },
];

const carGrid = document.getElementById('carGrid');
const searchInput = document.getElementById('searchInput');
const makeFilter = document.getElementById('makeFilter');
const priceFilter = document.getElementById('priceFilter');
const yearFilter = document.getElementById('yearFilter');
const fuelFilter = document.getElementById('fuelFilter');
const typeFilter = document.getElementById('typeFilter');

function displayCars(filteredCars) {
    carGrid.innerHTML = ''; // Clear previous results

    const carCards = filteredCars.map(car => {
        return `
            <div class="car-card">
                <button class="favorite-btn" onclick="toggleFavorite(this)">&#x2661;</button>
                <img src="${car.image}" alt="${car.make} ${car.model}">
                <h3>${car.make} ${car.model}</h3>
                <p>Year: ${car.year}</p>
                <p>Price: $${car.price.toLocaleString()}</p>
                <p>Fuel Type: ${car.fuelType}</p>
                <p>Type: ${car.carType}</p>
            </div>
        `;
    }).join('');

    carGrid.innerHTML = carCards; // Add all cards at once
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    button.innerHTML = button.classList.contains('active') ? '&#x2665;' : '&#x2661;';
}

function filterCars() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedMake = makeFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedYear = yearFilter.value;
    const selectedFuel = fuelFilter.value;
    const selectedType = typeFilter.value;

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

        const matchesType = selectedType === "" || car.carType === selectedType;

        return matchesSearch && matchesMake && matchesPrice && matchesYear && matchesFuel && matchesType;
    });

    displayCars(filteredCars);
}

searchInput.addEventListener('input', filterCars);
makeFilter.addEventListener('change', filterCars);
priceFilter.addEventListener('change', filterCars);
yearFilter.addEventListener('change', filterCars);
fuelFilter.addEventListener('change', filterCars);
typeFilter.addEventListener('change', filterCars);

// Initial display of all cars
displayCars(cars);

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
