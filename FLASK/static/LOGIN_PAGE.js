document.addEventListener("DOMContentLoaded", () => {
  const inputFields = document.querySelectorAll("input");
  const icons = document.querySelectorAll(".input-box i");

  inputFields.forEach((input, index) => {
    if (input.value !== "") {
      if (icons[index]) icons[index].style.color = "green";
      if (input.nextElementSibling) {
        input.nextElementSibling.style.display = "none";
      }
    }

    input.addEventListener("focus", () => {
      if (icons[index]) icons[index].style.color = "green";
    });

    input.addEventListener("blur", () => {
      if (icons[index]) icons[index].style.color = "white";
    });

    input.addEventListener("input", () => {
      if (input.value !== "") {
        input.nextElementSibling.style.display = "none";
      } else {
        input.nextElementSibling.style.display = "";
      }
    });
  });

  const form = document.querySelector('form[name="Formfill"]');
  form.addEventListener("submit", (event) => {
    if (!validation()) {
      return false; // Prevent form submission if validation fails
    }
   
  });

  icons.forEach((icon, index) => {
    icon.addEventListener("click", () => {
      inputFields[index].focus();
    });
  });
});

function validation() {
  const username = document.Formfill.Username;
  const password = document.Formfill.Password;

  clearError(username);
  clearError(password);

  if (username.value == "") {
    showError(username, "Enter Username*");
    return false;
  } else if (password.value == "") {
    showError(password, "Enter Password*");
    return false;
  } 
  else {
   
    const usernameValue = username.value;
    let len=usernameValue.length;
    let sub=usernameValue.substring(len-6,len);
    if(sub=="@admin"){
      if(usernameValue.substring(0,len-6)==""){
        showError(username, "INVALID ADMIN ACCESS*");
        return false;
      }
      if(password.value=="admin"){
        result.innerHTML = "";
        result.style.color = "green";
        return true;
      }
      console.log(password.value);
      showError(password, "INVALID ADMIN ACCESS*");
      return false;
    }
    
    result.innerHTML = "";
    result.style.color = "green";
    
    return true;
  }
}

function clearError(input) {
  input.style.borderColor = "";
  const icon = input.nextElementSibling;
  if (icon) {
    icon.style.color = "";
  }
  const result = document.getElementById("result");
  if (result) {
    result.innerHTML = "";
  }
}

function showError(input, message) {
  const result = document.getElementById("result");
  result.innerHTML = message;
  result.style.color = "red";
  const inputParent = input.parentNode;
  inputParent.style.borderColor = "red";
  const icon = input.nextElementSibling;
  if (icon) {
    icon.style.color = "red";
  }

  input.addEventListener("focus", () => {
    inputParent.style.borderColor = "";
    if (icon) {
      icon.style.color = "";
    }
  });

  if (icon) {
    icon.addEventListener("click", () => {
      input.focus();
      inputParent.style.borderColor = "";
      icon.style.color = "";
    });
  }
}


// 
// if user:
//             access_token=create_access_token(identity=username)
//             # print(access_token)
            
//             # update the error message to be displayed on the login page
//             error = ''
//             return jsonify(access_token=access_token), 200
// recieve token from server read json format into js
// var token = {{ token|tojson|safe }};



