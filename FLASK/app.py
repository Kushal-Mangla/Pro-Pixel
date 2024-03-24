import email
from email import message
from email.mime import audio, image
# import imp
import token
from traceback import print_exc
from flask import Flask, cli, render_template, request, redirect, url_for, jsonify, session,abort
import os, json, random
import mysql.connector
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# ------------------------------------------------------------------------------------------------
import pymysql


# ------------------------------------------------------------------------------------------------
from flask_mail import Mail, Message
import string

# ------------------------------------------------------------------------------------------------
# from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
app = Flask(__name__, static_url_path='/static')
# ------------------------------------------------------------------------------------------------
# update the folder where the uploaded files will be stored
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# ------------------------------------------------------------------------------------------------

# database connection
db_host = os.environ.get("DB_HOST", "localhost")
db_user = os.environ.get("DB_USER", "root")
db_password = os.environ.get("DB_PASSWORD", "CSD@AIR54")
db_name = os.environ.get("DB_NAME", "register")
# ------------------------------------------------------------------------------------------------  
# Mail Configuration
app.config.update(
    MAIL_SERVER='smtp-relay.brevo.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='trilogyiiith@gmail.com',
    # MAIL_PASSWORD='isk@241724'
    MAIL_PASSWORD='hPUMqsGYdXJHnvkI'
)
mail = Mail(app)
# ------------------------------------------------------------------------------------------------  
# for storing the verification codes
verification_codes = {}
# ------------------------------------------------------------------------------------------------
# Function to generate a random verification code
def generate_verification_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

# -----------------------------------------------------------------------------------------------
import jwt
# import datetime
app.config['SECRET_KEY'] = 'fsdnfcklsDbfksvbgdzjkfWFNAWILFNAWLEFBAWLNKLFKL'
from datetime import datetime, timedelta
# import datetime
from flask import session
def generate_jwt_token(username):
   # payload = {'username': username,'exp': datetime.utcnow() + timedelta(hours=1)}
    secret_key = app.config['SECRET_KEY'].encode('utf-8')  # Encode secret key as bytes
    token = jwt.encode( {'username': username,'exp': datetime.utcnow() + timedelta(hours=1)}, secret_key, algorithm='HS256')
    print("exp",datetime.utcnow() + timedelta(seconds=15))
    return token
def clear_session():
    session.pop('token', None)
    session.pop('username', None)
# ------------------------------------------------------------------------------------------------
# Function to send a forgot password email

def send_forgot_password_email(email, verification_code):
    msg = Message('Forgot Password - Verification Code', sender='your_email@example.com', recipients=[email])
    msg.body = f"Your Password for Pro Pixel is: {verification_code}"
    mail.send(msg)
    
# ------------------------------------------------------------------------------------------------

import psycopg2
db=""
try:
    db = psycopg2.connect("postgresql://trilogy:QQKrEc2GjPAdTx6Fq5ubvA@holytrinity-4075.7s5.aws-ap-south-1.cockroachlabs.cloud:26257/register?sslmode=verify-full")
except Exception as e:
    print("Not able to....",e)
    exit(0)
cursor = db.cursor()

cursor.execute(f"USE {db_name}")

# ------------------------------------------------------------------------------------------------

@app.route('/')
def index():
    return render_template('HomePage.html')

# ------------------------------------------------------------------------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('Username')
        password = request.form.get('Password')

        ind = username.find('@admin')
        if  ind != -1 and ind == len(username)-6:
            if password == 'admin':
                error = ''
                # session['username'] = "admin"+username[:-6]
                return redirect(url_for('admin', user=username[:-6]))
            else:
                return render_template('LOGIN_PAGE.html')
        # Add validation logic here if needed
        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()
        if user:
            # update the error message to be displayed on the login page
            token=generate_jwt_token(username)
            session['token'] = token
            session['username'] = username
            error = ''
            # return redirect(url_for('dragDrop', user=username))
            return redirect(url_for('dragDrop', token=token))
        else:
            error = 'Invalid username or password. Please try again.'
            
            return render_template('LOGIN_PAGE.html', error=error)
        # Redirect to the desired route after successful form submission
    else:
        if 'token' in session:
            # Token exists, redirect to user's homepage
            # return redirect(url_for('dragDrop', user=session['username']))
            return redirect(url_for('dragDrop', token=session['token']))
        return render_template('LOGIN_PAGE.html')
# ------------------------------------------------------------------------------------------------
@app.route('/logout')
def logout():
    # Remove the token from the session
    session.pop('token', None)
    session.pop('username', None)
    # Redirect the user to the login page or any other desired page
    return redirect(url_for('index'))
# ------------------------------------------------------------------------------------------------

@app.route('/ADMIN/<user>')
def admin(user):
    return render_template('ADMIN.html', user=user)

@app.route('/ADMIN/<user>/USERlist')
def userlist(user):
    data=[]
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    for user1 in users:
        data.append({'userId': user1[0], 'user': user1[1], 'email': user1[2], 'password': user1[3], 'projects': 0})
    return render_template('ADMIN_USERLIST.html', user=user,data=data)

#  -------------------------------------------------------------------------------------------------
@app.route('/session/expired')
def session_expired():
    return render_template('session.html')
@app.route('/error')
def error():
    return render_template('error.html')
@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html'), 404
@app.errorhandler(500)
def page_not_found(e):
    return render_template('error.html'), 500
#  -------------------------------------------------------------------------------------------------
from flask import request, redirect, render_template

@app.route('/upload/<token>', methods=['POST', 'GET'])
def dragDrop(token):
    global user
    if 'username' in session:
        user = session['username']
    else:
        return render_template('session.html')
    try:
        user = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['username']
    except jwt.ExpiredSignatureError:
        clear_session()
        return redirect(url_for('session_expired'))
    except jwt.InvalidTokenError:
        return render_template('userNotFound.html')
    cursor.execute("SELECT * FROM users WHERE username = %s", (user,))
    user = cursor.fetchone()
    if user:
        global email
        email = user[2] 
        user = user[1]
    else:
        return render_template('error.html')
    # decode the token and match with user
    
    if request.method == 'POST':
        if 'audio' in request.files:
            # Handle audio file upload
            return upload_audio(request, user)
        elif 'files' in request.files:
            # Handle image file upload
            return upload_image(request, user)
        else:
            return jsonify({'error': 'No files Uploaded!'})
    # res=cursor.fetchall()
    # print(res,"res")
    # Handle GET request or other cases
    return render_template('temp_drag_and_drop.html', token=token,user=user,email=email)

from werkzeug.utils import secure_filename

# ------------------------------------------------------------------------------------------------

def upload_image(request, user):
    
    print(request.files,"request.files")
    if 'files' not in request.files:
        return redirect(request.url)
    files = request.files.getlist('files')  # getlist is used to get multiple files
    # print(files,"files")
    for file in files:
        if file.filename == '':
            return redirect(request.url)
        
        filename = secure_filename(file.filename)  # secure_filename is used to secure the filename
        
        try:
            # Read the image data directly
            image_data = file.read()
            image_size = len(image_data)
            image_type = file.mimetype
            
            # Insert image data into the database
            with db.cursor() as cursor:
                sql = "INSERT INTO user_images (username, image_data, image_name, image_size, image_type) VALUES (%s, %s, %s, %s, %s)"
                username = user
                cursor.execute(sql, (username, psycopg2.Binary(image_data), filename, image_size, image_type))
                db.commit()  # Commit after each file is processed
        
        except Exception as e:
            print(f"Error inserting into database: {e}")
            continue  # Skip to the next file
    
    return jsonify({'message':'images uploaded successfully'})

# ------------------------------------------------------------------------------------------------

def upload_audio(request, user):
    # print(request.files,"request.files")
    audio_file = request.files['audio']

    if audio_file.filename == '':
        # returning in json format
        return jsonify({'error': 'No selected audio file'})
        # return 'No selected audio file', 400

    try:
        with db.cursor() as cursor:
            sql = "INSERT INTO user_audio (username, audio_file,audio_name) VALUES (%s, %s,%s)"
            username = user
            audio_data = audio_file.read()
            audio_name = audio_file.filename
            cursor.execute(sql, (username, audio_data, audio_name))
        db.commit()
        # return 'Audio file uploaded successfully and saved to database'
        return jsonify({'message':'Audio file uploaded successfully and saved to database'})

    except Exception as e:
        return f"Error: {e}"

from flask import send_file
from PIL import Image
import io
import base64

@app.route('/get_image/<image_id>')
def get_image(image_id):
    # Fetch image data from the database based on image_id
    query = "SELECT image_data FROM user_images WHERE id = %s"
    cursor.execute(query, (image_id,))
    result = cursor.fetchone()

    if result:
        # Get the image data from the result
        image_data = result[0].tobytes()  # Assuming the image data is stored as bytes in the database
        
        # Encode the image data to base64
        encoded_image = base64.b64encode(image_data).decode('utf-8')  # Decode bytes to string
        
        # Pass the encoded image data to the template as a string
        return render_template('kushal.html', image_data=encoded_image)

    else:
        return "Image not found", 404

# ------------------------------------------------------------------------------------------------

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        username = request.form['Username']
        email_input = request.form['Email']  # Rename to avoid overwriting email variable
        password = request.form['Password']
        
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        # print(user,"user  ")
        cursor.execute("SELECT * FROM users WHERE email = %s", (email_input,))
        email1 = cursor.fetchone()
        
        if user or email1:
            # If the user exists, return a JSON response indicating the username exists
            return jsonify({'error': 'User already exists'})
        else:
            # If the user does not exist, insert the user into the database
            cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email_input, password))
            db.commit()
            return jsonify({'success': 'User registered successfully'})
    else:
        return render_template('REGISTER.html')

# ------------------------------------------------------------------------------------------------

from flask import redirect, url_for, request

@app.route('/forgotpassword', methods=['POST', 'GET'])
def forgotpassword():
    if request.method == 'POST':
        username = request.form['Username']
        email_input = request.form['Email']
        cursor.execute("SELECT * FROM users WHERE username = %s AND email = %s", (username, email_input))
        user = cursor.fetchone()
        if user:
            cursor.execute("SELECT password FROM users WHERE username = %s AND email = %s",(username,email_input))
            verification_code = cursor.fetchone()
            send_forgot_password_email(email_input, verification_code)
            return jsonify({'success':'An Email has been sent!'})
        else:
            return jsonify({'error': 'Invalid username or email address'})
    # first check if the user exists in the database
    # And matches with the email
    return render_template('forgot-pass.html')

# ------------------------------------------------------------------------------------------------

@app.route('/verify/<user>', methods=['POST', 'GET'])
def verify(user):
    verification_code_from = request.args.get('verification_code')
    if request.method == 'POST':
        # Process the verification code sent by the user
        verification_code = request.form.get('VerificationCode')    
        if verification_code == verification_code_from:
            # Verification successful
            # del verification_codes[user]
            # add user in session
            token=generate_jwt_token(user)
            session['token'] = token
            session['username'] = user
            redirect(url_for('login'))
            # return jsonify({'success': 'Verification successful. Redirecting to dashboard...'})
        else:
            # Verification failed
            return jsonify({'error': 'Invalid verification code. Please try again.'})
    else:
        # Render the verification page template
        return render_template('verify.html')
    
# ------------------------------------------------------------------------------------------------

@app.route('/home/<user>')
def home(user):
    return render_template('drag_drop.html', user=user)

# ------------------------------------------------------------------------------------------------
@app.route('/deleteMusic/<user>', methods=['POST'])
def deleteMusic(user):
    audio_path = f"trimmed_audio_{user}.mp3"
    if os.path.exists(audio_path):
        os.remove(audio_path)
    return jsonify({'success': 'Audio file deleted successfully'})
# ------------------------------------------------------------------------------------------------

@app.route('/edit/<token>')
def edit(token):
    # same logic as dragDrop
    global user
    if 'username' in session:
        user = session['username']
    else:
        return render_template('session.html')
    try:
        user = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['username']
    except jwt.ExpiredSignatureError:
        clear_session()
        return redirect(url_for('session_expired'))
    except jwt.InvalidTokenError:
        return render_template('userNotFound.html')
    cursor.execute("SELECT * FROM users WHERE username = %s", (user,))
    user = cursor.fetchone()
    if user:
        global email
        email=user[2]
        user = user[1]
    else:
        return render_template('error.html')
    # decode the token and match with user
    
    image_data = []
    # retrieving all the stored images from the database to display on the edit page
    cursor.execute("SELECT * FROM user_images WHERE username = %s", (user,))
    images = cursor.fetchall()
    for image in images:
         # Get the image data from the result
        imageData = image[2].tobytes()  # Assuming the image data is stored as bytes in the database
        # Encode the image data to base64
        encoded_image = base64.b64encode(imageData).decode('utf-8')  # Decode bytes to string
        image_data.append({'image_id': image[0],'image_blob': encoded_image ,'image_name': image[3], 'image_size': image[4], 'image_type': image[5]})
    audio_data=[]
    cursor.execute("SELECT * FROM user_audio WHERE username = %s", (user,))
    audios=cursor.fetchall()
    for audio in audios:
        audio_blob = audio[2]
        audio_blob = audio_blob.tobytes()
        encoded_audio = base64.b64encode(audio_blob).decode('utf-8')
        audio_data.append({'audio_id': audio[0], 'audio_name': audio[4],'audio_blob': encoded_audio})
        # print(encoded_audio)
        audio_data.append({'audio_id': audio[0], 'audio_name': audio[4],'audio_blob': encoded_audio})
    return render_template('preview.html',token=token ,user=user, images=image_data, audios=audio_data,email=email)

# ------------------------------------------------------------------------------------------------
@app.route('/deleteVideo/<user>', methods=['POST'])
def deleteVideo(user):
    video_path = f"static/video/{user}_video.mp4"
    if os.path.exists(video_path):
        os.remove(video_path)
    if os.path.exists(f"trimmed_audio_{user}.mp3"):
        os.remove(f"trimmed_audio_{user}.mp3")
    if os.path.exists(f"static/video/{user}_video_360p.mp4"):
        os.remove(f"static/video/{user}_video_360p.mp4")
    if os.path.exists(f"static/video/{user}_video_480p.mp4"):
        os.remove(f"static/video/{user}_video_480p.mp4")
    if os.path.exists(f"static/video/{user}_video_720p.mp4"):
        os.remove(f"static/video/{user}_video_720p.mp4")
    if os.path.exists(f"static/video/{user}_video_1080p.mp4"):
        os.remove(f"static/video/{user}_video_1080p.mp4")
    # delete from the table of images and audios as well
    cursor.execute("DELETE FROM user_images WHERE username = %s", (user,))
    cursor.execute("DELETE FROM user_audio WHERE username = %s", (user,))
    db.commit()

    return jsonify({'success': 'Video file deleted successfully'})

from moviepy.editor import VideoFileClip
from moviepy.audio.io.AudioFileClip import AudioFileClip
from flask import request, jsonify
import requests
@app.route("/trim_audio/<user>", methods=["POST"])
def trim_audio(user):
    data = request.get_json()
    startTime = data["startTime"]
    endTime = data["endTime"]
    audioUrl = data["audioUrl"]
    if audioUrl.startswith("static/"):
        audio = AudioFileClip(audioUrl)
    else :
        audioName = audioUrl.split("/")[-1]
        cursor.execute('SELECT audio_file FROM user_audio WHERE audio_name = %s', (audioName,))
        # try to read the blob and add to audio
        test=cursor.fetchone()
        
    # print(audioUrl)
    # if audioUrl.startswith("static/"):
    #     audio = AudioFileClip(audioUrl)
    
    # else :
    #     response = requests.get(audioUrl)

    
    audio = AudioFileClip(audioUrl)
    
    trimmed_audio = audio.subclip(startTime, endTime)
    
    # Save the trimmed audio file
    trimmed_audio_path = f"trimmed_audio_{user}.mp3"
    # check for the audio file if it exists concatenate the audio
    if os.path.exists(trimmed_audio_path):
        audio = AudioFileClip(trimmed_audio_path)
        audio = concatenate_audioclips([audio, trimmed_audio])
        audio.write_audiofile(trimmed_audio_path)
    else:
        trimmed_audio.write_audiofile(trimmed_audio_path)
    # check for video file
    trimmed_audio=AudioFileClip(trimmed_audio_path)
    videoPath = f"static/video/{user}_video.mp4"
    if os.path.exists(videoPath):
        video = VideoFileClip(videoPath)
        # check for the length of the video and audio
        if video.duration < trimmed_audio.duration:
            trimmed_audio = trimmed_audio.subclip(0, video.duration)
        video = video.set_audio(trimmed_audio)
        video.write_videofile(videoPath, codec="libx264", fps=24)
    # trimmed_audio.write_audiofile(trimmed_audio_path)
    print("User in audio reached here")
    # Return the path to the trimmed audpio file
    return jsonify({"trimmed_audio_path": trimmed_audio_path})

# ------------------------------------------------------------------------------------------------
import io
import os
import base64
import numpy as np
from PIL import Image
from flask import request, jsonify
from moviepy.editor import ImageClip, concatenate_videoclips, vfx, VideoFileClip, CompositeVideoClip, TextClip, ColorClip, AudioFileClip, concatenate_audioclips

def crossfade(clip1, clip2, duration):
    return clip1.crossfadeout(duration).crossfadein(duration)

@app.route('/saveOrder/<user>', methods=['POST'])
def save_order(user):
    try:
        data = request.json
        image_data_urls = data.get('imageList', [])
        clips = []

        for data_url in image_data_urls:
            encoded_image_data = data_url['src'].split(',')[1]
            image_data = base64.b64decode(encoded_image_data)
            image_data_io = io.BytesIO(image_data)
            image = Image.open(image_data_io)
            image_array = np.array(image)
            image_clip = ImageClip(image_array, duration=data_url['duration'])
            clips.append(image_clip)

        # Create a video from the clips
        video_clip = concatenate_videoclips(clips, method="compose")    
        video_path = f"static/video/{user}_video.mp4"
        # Save the video to a file
        print(video_path)
        if os.path.exists(video_path):
            os.remove(video_path)
        # check for the audio file
        if os.path.exists(f"trimmed_audio_{user}.mp3"):
            audio_clip = AudioFileClip(f"trimmed_audio_{user}.mp3")
            if video_clip.duration < audio_clip.duration:
                audio_clip = audio_clip.subclip(0, video_clip.duration)
            video_clip = video_clip.set_audio(audio_clip)
        else:
            video_clip = video_clip.set_audio(None)
        video_clip.write_videofile(video_path, codec="libx264", fps=24)

        return jsonify({'success': 'Video created successfully', 'video_path': video_path})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------------------------------------------------------------------------------------    
from flask import request, jsonify
import os
import cv2
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from moviepy.editor import ImageClip, concatenate_videoclips, vfx

@app.route('/applyTransition/<user>', methods=['POST'])
def apply_transition(user):
    try:
        # Get the transition type and video path from the request
        transition_type = request.json.get('transitionType')
        video_path = f"static/video/{user}_video.mp4"
        
        # Load the image data URLs from the request
        image_data_urls = request.json.get('imageList', [])

        # Initialize a list to store processed video clips
        processed_clips = []

        # Loop through each image data URL and create video clips accordingly
        for image_data_url in image_data_urls:
            url = image_data_url['src']
            duration = image_data_url['duration']
            clip = image_data_url_to_clip(url, duration=duration)

            # Apply the appropriate transition based on the transition type
            if transition_type == 'Fade-In':
                faded_clip = clip.fx(vfx.fadein, duration=2)
                processed_clips.append(faded_clip)
            elif transition_type == 'Fade-Out':
                faded_clip = clip.fx(vfx.fadeout, duration=2)
                processed_clips.append(faded_clip)
            elif transition_type == 'Crossfade':
                processed_clips.append(clip)
            elif transition_type == 'B&W':
                bw_clip = clip.fx(vfx.blackwhite)
                processed_clips.append(bw_clip)
            elif transition_type == 'Vivid':
                vivid_clip = clip.fx(vfx.colorx, 1.5)
                processed_clips.append(vivid_clip)
            elif transition_type == 'Slide-In':
                slide_clip = clip.fx(vfx.slide_in, 1, 'right')
                processed_clips.append(slide_clip)  
            elif transition_type == 'Slide-Out':
                slide_clip = clip.fx(vfx.slide_out, 1, 'right')
                processed_clips.append(slide_clip)
            
            else:
                return jsonify({'error': f'Invalid transition type: {transition_type}'}), 400

        # Concatenate all processed clips into a single video clip
        final_clip = concatenate_videoclips(processed_clips, method="compose")
        # check for the audio file
        audio_path = f"trimmed_audio_{user}.mp3"
        if os.path.exists(audio_path):
            audio_clip = AudioFileClip(audio_path)
            if final_clip.duration < audio_clip.duration:
                audio_clip = audio_clip.subclip(0, final_clip.duration)
            final_clip = final_clip.set_audio(audio_clip)
        else:
            final_clip = final_clip.set_audio(None)
        # Write the final video clip to the output path
        final_clip.write_videofile(video_path, codec="libx264", fps=24)

        # Return a success response
        return jsonify({'success': f'Transition "{transition_type}" applied successfully'})

    except Exception as e:
        # If an error occurs during the transition processing, return an error response
        return jsonify({'error': str(e)}), 500

def image_data_url_to_clip(image_data_url, duration=4):
    """
    Convert base64-encoded image data URL to a video clip object.
    
    Args:
        image_data_url (str): Base64-encoded image data URL.
        duration (float): Duration of the clip in seconds (default is 4 seconds).
    
    Returns:
        moviepy.video.VideoClip.VideoClip: Video clip object representing the image.
    """
    _, encoded_data = image_data_url.split(',', 1)
    image_data = base64.b64decode(encoded_data)
    pil_image = Image.open(BytesIO(image_data))
    image_array = np.array(pil_image)
    clip = ImageClip(image_array, duration=duration)
    return clip

@app.route('/downloadVideo/<user>/<resolution>', methods=['GET'])
def download_video(user, resolution):
    try:
        print(type(resolution),resolution)
        original_video_path = f"static/video/{user}_video.mp4"
        output_video_path = f"static/video/{user}_video_{resolution}p.mp4"

        # Check if the original video file exists
        if not os.path.exists(original_video_path):
            return jsonify({'error': 'Video file not found'})

        # Check if the output video file already exists
        if os.path.exists(output_video_path):
            return send_file(output_video_path, as_attachment=True)

        # Load the original video clip
        video_clip = VideoFileClip(original_video_path)

        # Set the resolution of the video clip
        resolution=int(resolution)
        resized_clip = video_clip.resize(height=resolution)

        # Export the resized video clip
        resized_clip.write_videofile(output_video_path)

        # Return the path to the resized video file
        return send_file(output_video_path, as_attachment=True)

    except Exception as e:
        print(type(resolution),resolution)
        print(type(user),user)

        return str(e), 500


# ------------------------------------------------------------------------------------------------