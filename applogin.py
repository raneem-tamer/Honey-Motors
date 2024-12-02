from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS  # For cross-origin resource sharing
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask_caching import Cache
import os
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key')  # Use environment variable for secret key

# Configure MySQL
app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD', 'Honey@Motors')
app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB', 'honey_motors')

mysql = MySQL(app)

# Enable CORS for cross-origin requests
CORS(app)

# Configure caching
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')
handler = RotatingFileHandler('logs/app.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

# Set up Flask-Login
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

@app.route('/')
@cache.cached(timeout=50)  # Cache this route for 50 seconds
def home():
    return render_template('login.html')

@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        # Handle login logic for admin
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
        # Handle the login logic for the salesperson
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

if __name__ == '__main__':
    # Run in production mode
    app.run(host='0.0.0.0', port=5000)  # Bind to all interfaces