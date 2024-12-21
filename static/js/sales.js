// Simulated vehicle data with fuel type and image URL
let vehicleListings = [
    { id: 1, make: 'Toyota', model: 'Corolla', price: 20000, year: 2020, fuelType: 'Petrol', image: '' },
    { id: 2, make: 'Honda', model: 'Civic', price: 22000, year: 2021, fuelType: 'Diesel', image: '' },
    { id: 3, make: 'Ford', model: 'Focus', price: 19000, year: 2019, fuelType: 'Electric', image: '' },
];

// Function to display the form to add a new vehicle
function showAddForm() {
    resetForms();
    document.getElementById('add-vehicle-form').style.display = 'block';
    populateVehicleSelect();
}

// Function to display the form to update an existing vehicle
function showUpdateForm() {
    resetForms();
    document.getElementById('update-vehicle-form').style.display = 'block';
    populateVehicleSelect();
}

// Function to display the form to delete a vehicle
function showDeleteForm() {
    resetForms();
    document.getElementById('delete-vehicle-form').style.display = 'block';
    populateVehicleSelect();
}

// Function to reset all forms and hide the confirmation message
function resetForms() {
    document.getElementById('add-vehicle-form').style.display = 'none';
    document.getElementById('update-vehicle-form').style.display = 'none';
    document.getElementById('delete-vehicle-form').style.display = 'none';
    document.getElementById('confirmation-message').style.display = 'none';
}

// Function to populate the vehicle select dropdown for update and delete
function populateVehicleSelect() {
    const updateSelect = document.getElementById('select-vehicle');
    const deleteSelect = document.getElementById('delete-select');

    updateSelect.innerHTML = '<option value="" disabled selected>Select a vehicle</option>';
    deleteSelect.innerHTML = '<option value="" disabled selected>Select a vehicle</option>';

    vehicleListings.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.make} ${vehicle.model}`;
        updateSelect.appendChild(option);
        deleteSelect.appendChild(option.cloneNode(true));
    });
}

// Function to load vehicle details into the update form
function loadVehicleDetails() {
    const selectedVehicleId = document.getElementById('select-vehicle').value;

    if (!selectedVehicleId) return; // If no vehicle is selected, return early

    const vehicle = vehicleListings.find(v => v.id == selectedVehicleId);

    if (vehicle) {
        // Populate the update form with vehicle details
        document.getElementById('update-make').value = vehicle.make;
        document.getElementById('update-model').value = vehicle.model;
        document.getElementById('update-price').value = vehicle.price;
        document.getElementById('update-year').value = vehicle.year;
        document.getElementById('update-fuel-type').value = vehicle.fuelType;

        // Load the image if it exists
        const updateImageInput = document.getElementById('update-vehicle-image');
        if (vehicle.image) {
            updateImageInput.value = vehicle.image; // Assuming the image URL is stored
        }
    }
}

// Function to handle adding a new vehicle
function addVehicle() {
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const price = document.getElementById('price').value;
    const year = document.getElementById('year').value;
    const fuelType = document.getElementById('fuel-type').value;
    const image = document.getElementById('vehicle-image').files[0]; // Get the image file

    if (!make || !model || !price || !year || !fuelType) {
        alert('Please fill in all fields.');
        return;
    }

    // Simulate uploading the image (use a URL or base64 string for real scenarios)
    const imageUrl = image ? URL.createObjectURL(image) : '';

    const newVehicle = {
        id: vehicleListings.length + 1,
        make,
        model,
        price,
        year,
        fuelType,
        image: imageUrl,
    };

    vehicleListings.push(newVehicle);
    populateVehicleSelect();
    resetForms();
    alert('Vehicle added successfully!');
}

// Function to handle updating an existing vehicle
function updateVehicle() {
    const selectedVehicleId = document.getElementById('select-vehicle').value;

    if (!selectedVehicleId) {
        alert('Please select a vehicle to update.');
        return;
    }

    const vehicle = vehicleListings.find(v => v.id == selectedVehicleId);
    const make = document.getElementById('update-make').value;
    const model = document.getElementById('update-model').value;
    const price = document.getElementById('update-price').value;
    const year = document.getElementById('update-year').value;
    const fuelType = document.getElementById('update-fuel-type').value;
    const image = document.getElementById('update-vehicle-image').files[0]; // Get the new image file

    if (!make || !model || !price || !year || !fuelType) {
        alert('Please fill in all fields.');
        return;
    }

    // Simulate uploading the image (use a URL or base64 string for real scenarios)
    const imageUrl = image ? URL.createObjectURL(image) : vehicle.image; // Keep the old image if no new one is selected

    vehicle.make = make;
    vehicle.model = model;
    vehicle.price = price;
    vehicle.year = year;
    vehicle.fuelType = fuelType;
    vehicle.image = imageUrl;

    populateVehicleSelect();
    resetForms();
    alert('Vehicle updated successfully!');
}

// Function to handle deleting a vehicle
function deleteVehicle() {
    const selectedVehicleId = document.getElementById('delete-select').value;

    if (!selectedVehicleId) {
        alert('Please select a vehicle to delete.');
        return;
    }

    vehicleListings = vehicleListings.filter(vehicle => vehicle.id != selectedVehicleId);
    populateVehicleSelect();
    resetForms();
    alert('Vehicle deleted successfully!');
}

// Function to cancel any action and hide forms
function cancelAction() {
    resetForms();
}

// Function to show confirmation message after successful update
function showConfirmationMessage() {
    document.getElementById('confirmation-message').style.display = 'block';
}

// Function to hide the confirmation message
function hideConfirmation() {
    document.getElementById('confirmation-message').style.display = 'none';
}