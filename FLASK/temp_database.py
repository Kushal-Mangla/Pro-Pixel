import pymysql
from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database connection
connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='jee@1504',
                             database='register',
                             cursorclass=pymysql.cursors.DictCursor)

@app.route('/')
def index():
    return render_template('drag_drop.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return redirect(request.url)
    
    files = request.files.getlist('file')

    for file in files:
        if file.filename == '':
            return redirect(request.url)

        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Now insert the data into the database
        with connection.cursor() as cursor:
            sql = "INSERT INTO user_images (username, image_data, image_name, image_size, image_type) VALUES (%s, %s, %s, %s, %s)"
            username = 'example_username'  # You can retrieve the username from the session or request
            image_data = file.read()
            image_size = os.path.getsize(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            image_type = file.mimetype
            cursor.execute(sql, (username, image_data, filename, image_size, image_type))
        
        connection.commit()

    return 'Files uploaded successfully'

if __name__ == '__main__':
    app.run(debug=True)





# @app.route('/<user>/upload', methods=['POST', 'GET'])
# def dragDrop(user):
#     if request.method == 'POST':
#         if 'file' not in request.files:
#             return redirect(request.url)
#         files = request.files.getlist('file')
#         for file in files:
#             if file.filename == '':
#                 return redirect(request.url)
#             filename = secure_filename(file.filename)
#             file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             # return file_path
#             file.save(file_path)

    
#         with db.cursor() as cursor:
#             sql = "INSERT INTO user_images (username, image_data, image_name, image_size, image_type) VALUES (%s, %s, %s, %s, %s)"
#             username = user  # Assuming username is passed as a route parameter
#             image_data = file.read()  # Read the file contents from the file object
#             image_size = os.path.getsize(file_path)
#             image_type = file.mimetype
#             cursor.execute(sql, (username, image_data, filename, image_size, image_type))
#         db.commit()
#         os.remove(file_path)  # Remove the file after saving to the database
#   # Remove the file after saving to the database
#         return 'File uploaded successfully'
#     return render_template('temp_drag_and_drop.html', user=user)