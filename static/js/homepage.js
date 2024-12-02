const cars = [
    { image: "static/images/toyota.jpg", make: "Toyota", model: "Camry", year: 2022, price: 25000 },
    { image: "static/images/Pagani.jpg", make: "Honda", model: "Civic", year: 2023, price: 22000 },
    { image: "static/images/S600.jpg", make: "Ford", model: "Mustang", year: 2021, price: 35000 },
    { image: "static/images/Ford gt.jpg", make: "Toyota", model: "Rav4", year: 2023, price: 28000 },
];

const carGrid = document.getElementById('carGrid');

function displayCars(cars) {
    carGrid.innerHTML = '';
    cars.forEach(car => {
        const carCard = `
            <div class="car-card">
                <button class="favorite-btn" onclick="toggleFavorite(this)">&#x2661;</button>
                <img src="${car.image}" alt="${car.make} ${car.model}">
                <h3>${car.make} ${car.model}</h3>
                <p>Year: ${car.year}</p>
                <p>Price: $${car.price.toLocaleString()}</p>
            </div>
        `;
        carGrid.innerHTML += carCard;
    });
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    if (button.classList.contains('active')) {
        button.innerHTML = '&#x2665;'; // Solid heart for favorite
    } else {
        button.innerHTML = '&#x2661;'; // Outline heart for non-favorite
    }
}

displayCars(cars);
