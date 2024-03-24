from flask import Flask, request, render_template
from flask_mail import Mail, Message
import random
import string

app = Flask(__name__)
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='trilogyiiith@gmail.com',
    MAIL_PASSWORD='isk@241724'
)
mail = Mail(app)
# f
# Store verification codes in a dictionary (in-memory storage for demonstration purposes)
verification_codes = {}

# Route for forgot password
@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        verification_code = generate_verification_code()
        verification_codes[email] = verification_code  # Store verification code temporarily
        send_forgot_password_email(email, verification_code)
        return "Verification code sent to your email"
    return render_template('forgot_password.html')

# Route for verifying the entered verification code
@app.route('/verify_code', methods=['POST'])
def verify_code():
    email = request.form['email']
    entered_code = request.form['verification_code']
    
    if email in verification_codes and verification_codes[email] == entered_code:
        # Verification code matched
        del verification_codes[email]  # Remove the entry from the dictionary
        return "Verification code matched. Proceed with password reset."
    else:
        # Verification code didn't match or not found
        return "Invalid verification code. Please try again."

# Helper function to generate verification code
def generate_verification_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

# Helper function to send forgot password email
def send_forgot_password_email(email, verification_code):
    msg = Message('Forgot Password - Verification Code', sender='your_email@example.com', recipients=[email])
    msg.body = f"Your verification code is: {verification_code}"
    mail.send(msg)

if __name__ == '__main__':
    app.run(debug=True)
