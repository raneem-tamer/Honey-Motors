window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('vehicleId'); // Get vehicle ID from the URL
    
    const form = document.getElementById('purchaseForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission

        // Display a processing message
        alert('Your purchase is being processed, please wait...');
  
        // Gather form data
        const formData = {
            vehicleId: vehicleId,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
          
            model: document.getElementById('model').value,
            year: document.getElementById('year').value,
            price: document.getElementById('price').value,
            fuel_type: document.getElementById('fuel_type').value,
            location: document.getElementById('location').value
        };

        // Send data to the server (replace with your API endpoint)
        fetch('http://yourserver.com/completePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            // Confirm success to the user
            alert('Purchase successful! Thank you for your order.');
            window.location.href = 'index.html'; // Redirect after purchase
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
    });
};
