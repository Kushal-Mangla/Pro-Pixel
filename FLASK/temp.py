from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import os, json, random
import mysql.connector
from flask_mail import Mail, Message
import random
import string

app = Flask(__name__, static_url_path='/static')

# Database connection details
db_host = os.environ.get("DB_HOST", "localhost")
db_user = os.environ.get("DB_USER", "root")
db_password = os.environ.get("DB_PASSWORD", "CSD@AIR54")
db_name = os.environ.get("DB_NAME", "register")

# Mail configuration
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='trilogyiiith@gmail.com',
    MAIL_PASSWORD='isk@241724'
)
mail = Mail(app)

# MySQL database connection
db = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name
)
cursor = db.cursor()
cursor.execute(f"USE {db_name}")

verification_codes = {}

def generate_verification_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

def send_forgot_password_email(email, verification_code):
    msg = Message('Forgot Password - Verification Code', sender='your_email@example.com', recipients=[email])
    msg.body = f"Your verification code is: {verification_code}"
    mail.send(msg)

@app.route('/')
def index():
    return render_template('HomePage.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Your existing login logic here
        pass
    else:
        return render_template('LOGIN_PAGE.html')

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        # Your existing signup logic here
        pass
    else:
        return render_template('REGISTER.html')

@app.route('/forgotpassword', methods=['POST', 'GET'])
def forgotpassword():
    if request.method == 'POST':
        # Your existing forgot password logic here
        pass
    else:
        return render_template('forgot-pass.html')

@app.route('/verify/<user>', methods=['POST', 'GET'])
def verify(user):
    if request.method == 'POST':
        # Your existing verification logic here
        pass
    else:
        return render_template('verify.html')

@app.route('/home/<user>')
def home(user):
    return render_template('drag_drop.html', user=user)

@app.route('/<user>/upload', methods=['POST'])
def upload(user):
    if request.method == 'POST':
        image_files = request.files.getlist('imageFiles')  # Assuming input name is 'imageFiles'
        insert_files_into_database(user, image_files)
        return jsonify({'success': 'Files uploaded successfully'})
    else:
        return redirect(url_for('dragDrop', user=user))

def insert_files_into_database(user, files):
    # Prepare the SQL query to insert file data into the user_images table
    query = f"INSERT INTO user_images (username, "
    for i in range(len(files)):
        query += f"img{i + 1}, "
    query = query[:-2] + ") VALUES (%s, " + "%s, " * len(files) + ")"
    
    # Prepare the data to be inserted
    data = [user]
    for file in files:
        data.append(file.read())
    
    # Execute the SQL query
    cursor.execute(query, tuple(data))
    db.commit()

if __name__ == '__main__':
    app.run(debug=True)
