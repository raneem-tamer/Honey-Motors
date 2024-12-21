from flask import Flask, render_template, request, redirect, url_for, flash, session 
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import pymysql
import os
import logging
from logging.handlers import RotatingFileHandler
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key')

# Swagger configuration
SWAGGER_URL = '/api/docs'  # URL for accessing Swagger UI
API_URL = '/static/swagger.yaml'  # Path to the Swagger YAML file
swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "Vehicle Management API"})
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)


# Configure MySQL
app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD', 'Honey@Motors')
app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB', 'honey_motors')

mysql = MySQL(app)
CORS(app)

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')
handler = RotatingFileHandler('logs/app.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

# Flask-Login configuration
login_manager = LoginManager(app)

class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT id, username FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    return User(user[0], user[1]) if user else None

# Routes
@app.route('/')
def home():
    content = {"title": "Welcome to the Car Store", "description": "Find your dream car here!"}
    return render_template('homepage.html', content=content)

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    cursor = mysql.connection.cursor()
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        preferences = request.form['preferences']

        cursor.execute('UPDATE users SET username = %s, email = %s, preferences = %s WHERE id = %s',
                       (name, email, preferences, session['user_id']))
        mysql.connection.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))

    cursor.execute('SELECT username, email, preferences FROM users WHERE id = %s', (session['user_id'],))
    user = cursor.fetchone()
    cursor.close()

    return render_template('profile.html', user=user)

@app.route('/vehicle', methods=['GET', 'POST'])
@login_required
def vehicle():
    cursor = mysql.connection.cursor()
    
    if request.method == 'POST':
        vehicle_id = request.form['vehicle_id']
        cursor.execute('SELECT * FROM vehicles WHERE id = %s', (vehicle_id,))
        vehicle = cursor.fetchone()
        cursor.close()
        return render_template('vehicle.html', vehicle=vehicle)

    # Fetch all vehicles if not a POST request
    cursor.execute('SELECT * FROM vehicles')
    vehicles = cursor.fetchall()
    cursor.close()
    
    return render_template('vehicle.html', vehicle=vehicles)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, password FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        
        if user and check_password_hash(user[1], password):
            login_user(User(user[0], email))
            flash('Login successful!', 'success')
            next_page = request.args.get('next', default=url_for('vehicle'))
            return redirect(next_page)

        flash('Invalid credentials, please try again.', 'danger')
    return render_template('login.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        
        try:
            cursor = mysql.connection.cursor()
            cursor.execute(
                'INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)', 
                (name, email, message)
            )
            mysql.connection.commit()
            cursor.close()
            flash(f"Thank you, {name}. Your message has been received.", "success")
        except pymysql.MySQLError as e:
            flash(f"An error occurred while saving your message: {e}", "danger")
            app.logger.error(f"Error in contact submission: {str(e)}")

        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/homeabout')
def about():
    about_info = {"title": "About Us", "description": "We are dedicated to providing the best cars for you!"}
    return render_template('homeabout.html', about_info=about_info)

@app.route('/help')
def help_page():
    return render_template('help.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, password, role FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        
        if user and check_password_hash(user[1], password):
            if user[2] == 'admin':  # Check if the user is an admin
                login_user(User(user[0], email))
                flash('Login successful, welcome Admin!', 'success')
                return redirect(url_for('admin_dashboard'))  # Redirect to admin dashboard
            else:
                flash('Unauthorized access. Admin only.', 'danger')
                return redirect(url_for('admin_login'))  # Redirect back to admin login page
        
        flash('Invalid credentials, please try again.', 'danger')
    
    return render_template('admin_login.html')

@app.route('/admin-user-management')
@login_required
def admin_user_management():
    # Ensure the logged-in user is an admin
    if current_user.is_authenticated:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT role FROM users WHERE id = %s', (current_user.id,))
        user = cursor.fetchone()
        cursor.close()

        if user and user[0] == 'admin':
            # Fetch all users (you can customize this query to your needs)
            cursor = mysql.connection.cursor()
            cursor.execute('SELECT id, username, email FROM users')
            users = cursor.fetchall()
            cursor.close()

            return render_template('admin_user_management.html', users=users)
        else:
            flash('Unauthorized access. Admin only.', 'danger')
            return redirect(url_for('home'))  # Redirect to home if not an admin
    else:
        flash('You must log in to access the dashboard.', 'danger')
        return redirect(url_for('admin_login'))  # Redirect to admin login page


@app.route('/user-login', methods=['GET', 'POST'])
def user_login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, password FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        
        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            login_user(User(user[0], email))
            flash('Login successful!', 'success')
            return redirect(url_for('vehicle'))
        flash('Invalid credentials, please try again.', 'danger')

    return render_template('user_login.html')

@app.route('/user-signup', methods=['GET', 'POST'])
def user_signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        role = request.form['role']

        hashed_password = generate_password_hash(password, method='pbk2:sha256')

        try:
            cursor = mysql.connection.cursor()
            cursor.execute(
                'INSERT INTO users (username, email, phone, password, role) VALUES (%s, %s, %s, %s, %s)',
                (name, email, phone, hashed_password, role)
            )
            mysql.connection.commit()
            cursor.close()
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('user_login'))
        except Exception as e:
            mysql.connection.rollback()
            app.logger.error(f'Error during signup: {str(e)}')
            flash('An error occurred while creating your account. Please try again.', 'danger')

    return render_template('user_signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))
@app.route('/purchase', methods=['GET', 'POST'])
def purchase():
    if request.method == 'POST':
        # Handle the purchase process here
        pass
    return render_template('purchase.html')
@app.route('/admin-dashboard')
@login_required
def admin_dashboard():
    if current_user.is_authenticated:
        # Ensure that the logged-in user is an admin
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT role FROM users WHERE id = %s', (current_user.id,))
        user = cursor.fetchone()
        cursor.close()

        if user and user[0] == 'admin':
            # Render the admin dashboard page
            return render_template('admin_dashboard.html')
        else:
            flash('Unauthorized access. Admin only.', 'danger')
            return redirect(url_for('home'))  # Redirect to home if not an admin
    else:
        flash('You must log in to access the dashboard.', 'danger')
        return redirect(url_for('admin_login'))  # Redirect to admin login page

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.logger.info("Running the Vehicle Management Application")
    app.run(host='0.0.0.0', port=5000)
