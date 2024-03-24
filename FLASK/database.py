from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
import os

app = Flask(__name__, static_url_path='/static')

# Get database credentials from environment variables
db_host = os.environ.get("DB_HOST", "localhost")
db_user = os.environ.get("DB_USER", "root")
db_password = os.environ.get("DB_PASSWORD", "CSD@AIR54")
db_name = os.environ.get("DB_NAME", "register")

# Connect to MySQL database
db = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name
)
cursor = db.cursor()

cursor.execute(f"USE {db_name}")

# Create users table if it doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
""")

# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     if request.method == 'POST':
#         username = request.form['Username']
#         email = request.form['Email']
#         password = request.form['Password']

#         # Insert data into the database
#         cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
#         db.commit()

#         return redirect(url_for('login'))  # Redirect to login page after successful registration
#     else:
#         return render_template('REGISTER.html')

if __name__ == '__main__':
    app.run(debug=True)
    # <form action="{{ url_for('signup') }}" name="Formfill" onsubmit="return validation()" method="POST">


