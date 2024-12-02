from flask import Flask, render_template, request, redirect, url_for, flash
import pymysql
from waitress import serve


# Flask app initialization
app = Flask(__name__)
app.secret_key = "your_secret_key"  # Required for flash messages or session management



# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Honey@Motors',
    'database': 'honey_motors',
}

# Routes
@app.route('/')
def home():
    return render_template('homeabout.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        
        # Save message to the database
        try:
            connection = pymysql.connect(**db_config)
            with connection.cursor() as cursor:
                sql = """
                    INSERT INTO contact_messages (name, email, message)
                    VALUES (%s, %s, %s)
                """
                cursor.execute(sql, (name, email, message))
                connection.commit()
                flash(f"Thank you, {name}. Your message has been received.", "success")
        except pymysql.MySQLError as e:
            flash(f"An error occurred while saving your message: {e}", "danger")
        finally:
            connection.close()
        
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/help')
def help_page():
    return render_template('help.html')

@app.route('/services')
def services():
    return render_template('services.html')

if __name__ == '__main__':
    # Run in production mode
    app.run(host='0.0.0.0', port=5000)  # Bind to all interfaces