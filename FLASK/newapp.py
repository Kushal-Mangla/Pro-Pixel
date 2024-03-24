from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import os
import json
import random
import string
import psycopg2
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message

app = Flask(__name__, static_url_path='/static')

# Update the folder where the uploaded files will be stored
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Mail configuration
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='trilogyiiith@gmail.com',
    MAIL_PASSWORD='isk@241724'
)
mail = Mail(app)

# For storing the verification codes
verification_codes = {}


def generate_verification_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))


def send_forgot_password_email(email, verification_code):
    msg = Message('Forgot Password - Verification Code', sender='your_email@example.com', recipients=[email])
    msg.body = f"Your verification code is: {verification_code}"
    mail.send(msg)


# Connect to CockroachDB using the provided connection string
conn = psycopg2.connect(os.environ.get("postgresql://trilogy:PtTFzDd6VMJKohsq1MMx5g@holytrinity-4062.7s5.aws-ap-south-1.cockroachlabs.cloud:26257/register?sslmode=verify-full"
))
cursor = conn.cursor()

@app.route('/')
def index():
    return render_template('HomePage.html')

# The rest of your Flask app routes and functions...

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('Username')
        password = request.form.get('Password')

        ind = username.find('@admin')
        if ind != -1 and ind == len(username) - 6:
            if password == 'admin':
                error = ''
                return redirect(url_for('admin', user=username[:-6]))
            else:
                return render_template('LOGIN_PAGE.html')

        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()

        if user:
            error = ''
            return redirect(url_for('dragDrop', user=username))
        else:
            error = 'Invalid username or password. Please try again.'
            return render_template('LOGIN_PAGE.html', error=error)

    return render_template('LOGIN_PAGE.html')


@app.route('/ADMIN/<user>')
def admin(user):
    return render_template('ADMIN.html', user=user)


@app.route('/ADMIN/<user>/USERlist')
def userlist(user):
    data = []
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    for user1 in users:
        data.append({'userId': user1[0], 'user': user1[1], 'email': user1[2], 'password': user1[3], 'projects': 0})
    return render_template('ADMIN_USERLIST.html', user=user, data=data)


@app.route('/<user>/upload', methods=['POST', 'GET'])
def dragDrop(user):
    if request.method == 'POST':
        if 'audio' in request.files:
            # Handle audio file upload
            return upload_audio(request, user)
        elif 'file' in request.files:
            # Handle image file upload
            return upload_image(request, user)
        else:
            return 'No files uploaded', 400

    return render_template('temp_drag_and_drop.html', user=user)


def upload_audio(request, user):
    audio_file = request.files['audio']

    if audio_file.filename == '':
        return 'No selected audio file', 400

    try:
        # Save audio file to database
        cursor.execute("INSERT INTO user_audio (username, audio_file) VALUES (%s, %s)",
                       (user, psycopg2.Binary(audio_file.read())))
        conn.commit()
        return 'Audio file uploaded successfully and saved to database'

    except Exception as e:
        return f"Error: {e}"


def upload_image(request, user):
    if 'file' not in request.files:
        return 'No image file uploaded', 400

    files = request.files.getlist('file')
    for file in files:
        if file.filename == '':
            return 'No selected image file', 400

        try:
            # Save image file to database
            cursor.execute("INSERT INTO user_images (username, image_data, image_name, image_size, image_type) "
                           "VALUES (%s, %s, %s, %s, %s)",
                           (user, psycopg2.Binary(file.read()), secure_filename(file.filename),
                            len(file.read()), file.mimetype))
            conn.commit()

        except Exception as e:
            return f"Error: {e}"

    return 'Image files uploaded successfully and saved to database'


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        username = request.form['Username']
        email_input = request.form['Email']
        password = request.form['Password']

        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email_input,))
        email1 = cursor.fetchone()

        if user or email1:
            return jsonify({'error': 'User already exists'})
        else:
            cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                           (username, email_input, password))
            conn.commit()
            return jsonify({'success': 'User registered successfully'})
    else:
        return render_template('REGISTER.html')


@app.route('/forgotpassword', methods=['POST', 'GET'])
def forgotpassword():
    if request.method == 'POST':
        username = request.form['Username']
        email_input = request.form['Email']
        cursor.execute("SELECT * FROM users WHERE username = %s AND email = %s", (username, email_input))
        user = cursor.fetchone()
        if user:
            verrification_code = generate_verification_code()
            verification_codes[username] = verrification_code
            return jsonify({'success': 'An email has been sent to your email address', 'user': username})
        else:
            return jsonify({'error': 'Invalid username or email address'})

    return render_template('forgot-pass.html')


@app.route('/verify/<user>', methods=['POST', 'GET'])
def verify(user):
    if request.method == 'POST':
        verification_code = request.form.get('VerificationCode')

        if verification_code == verification_codes[user]:
            del verification_codes[user]
            return jsonify({'success': 'Verification successful. Redirecting to dashboard...'})
        else:
            return jsonify({'error': 'Invalid verification code. Please try again.'})
    else:
        return render_template('verify.html')


@app.route('/home/<user>')
def home(user):
    return render_template('drag_drop.html', user=user)


@app.route('/<user>/edit')
def edit(user):
    return render_template('preview.html', user=user)


if __name__ == '__main__':
    app.run(debug=True)
