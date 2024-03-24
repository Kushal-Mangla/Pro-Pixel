def generate_jwt_token(username):
   # payload = {'username': username,'exp': datetime.utcnow() + timedelta(hours=1)}
    secret_key = app.config['SECRET_KEY'].encode('utf-8')  # Encode secret key as bytes
    token = jwt.encode( {'username': username,'exp': datetime.utcnow() + timedelta(hours=1)}, secret_key, algorithm='HS256')
    return token


@app.route('/',methods=['GET','POST'])
def index():
    global temp_user
    if 'username' in session:
        temp_user = session['username']
    else:
        temp_user = 'admin'
    return render_template('index.html')

@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'POST':
       token = None
       username = request.form.get('username')
       password = request.form.get('password')
       password=hash_password(password)

       cur = conn.cursor()
       cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
       user = cur.fetchone()
       cur.close()
    

       if user:
            token = generate_jwt_token(username)
            session['token'] = token
            session['username'] = username
            return redirect(url_for('user_homepage',token=token))
       else:
           alert_message = "wrong username or password"
           return render_template('login_page.html', alert_message=alert_message)
           

    if 'token' in session:
        # Token exists, redirect to user's homepage
        return redirect(url_for('user_homepage', token=session['token']))

    else:
        # Token doesn't exist, show login form
        return render_template('login_page.html')

@app.route('/logout')
def logout():
    # Remove the token from the session
    session.pop('token', None)
    # Redirect the user to the login page or any other desired page
    return redirect(url_for('index'))


@app.route('/forgetpage',methods=['GET','POST'])
def forgetpage():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('pwd')
        cpassword = request.form.get('cpwd')
        dob = request.form.get('DOB')
        security_question = request.form.get('security_question')
        security_ans = request.form.get('security_ans')

        password = hash_password(password)
        # print(f"Checking for user: {username}")

        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s and dob = %s and security_question = %s and security_ans = %s", (username, dob, security_question, security_ans))
        user = cur.fetchone()

        if user:
            # User found, update the password in the database
             # Assuming cpassword is the new password
            cur.execute("UPDATE users SET password = %s WHERE username = %s", (password, username))
            conn.commit()
            cur.close()

            alert_message = "Password changed successfully"
            #print(f"User found: {username}")
            return render_template('forgetpage.html', alert_message=alert_message)
        else:
            cur.close()
            alert_message = "User not found"
            # print(f"User not found: {username}")
            return render_template('forgetpage.html', alert_message=alert_message)

    return render_template('forgetpage.html')

@app.route('/user_homepage/<token>', methods=['GET', 'POST'])
def user_homepage(token):
    global temp_user
    if 'username' in session:
        temp_user = session['username']
    else:
        temp_user = 'admin'
    
    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token['username']
       
    except jwt.ExpiredSignatureError:
   
        return redirect(url_for('login'))
    except jwt.InvalidTokenError:
        return redirect(url_for('login'))
    
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    

    if not user:
        abort(404)


    user_data = {
        'username': user[3],
        'name': user[1],
        'dob':user[2],
        'user_id':user[0],

    }
    temp_user = user[3]

    cur.execute("SELECT image_blob FROM profile_pic WHERE username = %s", (temp_user,))
    profile_pic_data = cur.fetchone()
    profile_pic = None
    if profile_pic_data:
        print("helloji")
        profile_pic = base64.b64encode(profile_pic_data[0]).decode('utf-8')
    else:
        print("yo")
        with open("static/images/pfp.avif", 'rb') as f:
            profile_pic = base64.b64encode(f.read()).decode('utf-8')


    grouped_images = defaultdict(list) 
    cur.execute("SELECT image_blob, date FROM image_data WHERE username = %s ORDER BY date DESC", (temp_user,))
    images_data = cur.fetchall()
    cur.close()

    for image_blob, date in images_data:
        grouped_images[date].append(base64.b64encode(image_blob).decode('utf-8'))

    grouped_images = dict(grouped_images)
    print(len(profile_pic))
    print(profile_pic[:20])

    return render_template("user_homepage.html", user_data=user_data, grouped_images=grouped_images,profile_pic=profile_pic)