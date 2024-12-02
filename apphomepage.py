from flask import Flask, render_template, request, redirect, url_for, flash, session
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key') 

# Route for the homepage
@app.route('/')
def home():
    # Instead of querying the database, we'll just pass some static content for demonstration
    content = {"title": "Welcome to the Car Store", "description": "Find your dream car here!"}
    return render_template('homepage.html', content=content)

# Route for the about page
@app.route('/homeabout')
def about():
    # Static about page content
    about_info = {"title": "About Us", "description": "We are dedicated to providing the best cars for you!"}
    return render_template('homeabout.html', about_info=about_info)

@app.route('/vehicle')
def vehicle():
    # Static vehicle data (replace with real data in production)
    vehicles = [
        {"make": "Toyota", "model": "Corolla", "year": 2023, "price": "$20,000", "fuel_type": "Gasoline", "type": "Sedan"},
        {"make": "Honda", "model": "Civic", "year": 2022, "price": "$22,000", "fuel_type": "Hybrid", "type": "SUV"},
        {"make": "Ford", "model": "Focus", "year": 2021, "price": "$18,000", "fuel_type": "Diesel", "type": "Hatchback"}
    ]
    return render_template('vehicle.html', vehicles=vehicles)


# Route for user login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        # Here, you would validate the credentials, but for now we'll simulate a successful login
        if email == 'user@example.com' and password == 'password':
            session['user_id'] = 1  # Simulating a user ID for session
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid credentials, please try again.', 'danger')
    return render_template('login.html')

# Custom error handler for 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
if __name__ == '__main__':
    # Run in production mode
    app.run(host='0.0.0.0', port=5000)  # Bind to all interfaces