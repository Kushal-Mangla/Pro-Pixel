from flask import Flask, render_template, request, redirect, jsonify
from flask_mysqldb import MySQL
import base64

app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'holytrinity-4075.7s5.aws-ap-south-1.cockroachlabs.cloud'
app.config['MYSQL_USER'] = 'trilogy'
app.config['MYSQL_PASSWORD'] = 'QQKrEc2GjPAdTx6Fq5ubvA'
app.config['MYSQL_DB'] = 'register'

mysql = MySQL(app)

@app.route('/display')
def display():
    uploaded_images = []
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT image_data FROM user_images")
        image_data = cursor.fetchall()
        cursor.close()

        for data in image_data:
            try:
                encoded_image = base64.b64encode(data[0]).decode('utf-8')
                uploaded_image = f"data:image/jpeg;base64,{encoded_image}"
                uploaded_images.append(uploaded_image)
            except Exception as e:
                print(f"Error decoding image data: {e}")

        return render_template('display.html', uploaded_images=uploaded_images)
    except Exception as e:
        print(f"Error fetching images from database: {e}")
        return jsonify({'error': f"Error fetching images from database: {e}"})


@app.route("/", methods=['GET', 'POST'])
def start():
    return render_template('databasee.html')


@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        images = request.files.getlist('images')
        try:
            for image in images:
                image_bytes = image.read()
                cursor = mysql.connection.cursor()
                cursor.execute("INSERT INTO user_images (image_data) VALUES (%s)", (image_bytes,))
                mysql.connection.commit()
                cursor.close()
            return 'Images uploaded successfully'
        except Exception as e:
            return f'An error occurred: {str(e)}'
    return 'No images were uploaded'


if __name__ == '__main__':
    app.run(debug=True)
