from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask_caching import Cache
import pymysql
import os
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key')

# Configure MySQL
app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD', 'Honey@Motors')
app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB', 'honey_motors')

mysql = MySQL(app)
CORS(app)  # Enable CORS for cross-origin requests
cache = Cache(app, config={'CACHE_TYPE': 'simple'})  # Configure caching

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

@app.route('/homeabout')
def about():
    about_info = {"title": "About Us", "description": "We are dedicated to providing the best cars for you!"}
    return render_template('homeabout.html', about_info=about_info)

@app.route('/vehicle')
def vehicle():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM vehicles')
    cars = cursor.fetchall()
    cursor.close()
    return render_template('vehicle.html', cars=cars)

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
            return redirect(url_for('home'))
        else:
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

@app.route('/help')
def help_page():
    return render_template('help.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        return redirect(url_for('home'))
    return render_template('admin_login.html')

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
            login_user(User(user[0], email))
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid credentials, please try again.', 'danger')

    return render_template('user_login.html')

@app.route('/salesperson-login', methods=['GET', 'POST'])
def salesperson_login():
    if request.method == 'POST':
        return redirect(url_for('home'))
    return render_template('salesperson_login.html')

@app.route('/user-signup', methods=['GET', 'POST'])
def user_signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        role = request.form['role']

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

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
            app.logger.error(f'Error during signup: {str(e)}')  # Log error
            flash('An error occurred while creating your account. Please try again.', 'danger')

    return render_template('user_signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.logger.info("Running the Vehicle Management Application")
    app.run(host='0.0.0.0', port=5000)
