// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.querySelector('form[name="Formfill"]');
//     form.addEventListener('submit', function(event) {
//         event.preventDefault();
//         if (validation()) {
//             const popup = document.getElementById('popup');
//             popup.classList.add('open-slide');
//         }
//     });
// });


var popup=document.getElementById('popup');
function CloseSlide(){
    popup.classList.remove('open-slide');
}
function validation() {
    var username = document.Formfill.Username;
    var email = document.Formfill.Email;
    var password = document.Formfill.Password;
    var cPassword = document.Formfill.cPassword;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    clearError(username);
    clearError(email);
    clearError(password);
    clearError(cPassword);

    if (username.value == "") {
        showError(username, "Enter Username*");
        return false;
    } else if (username.value.length < 8) {
        showError(username, "At least 8 characters in username*");
        return false;
    } else if (email.value == "") {
        // check if it has a valid email format
        // '@gmail.com'

        showError(email, "Enter your Email*");
        return false;
    } else if(!emailRegex.test(email.value)){
            showError(email, "Email is not valid");
            return false;
    } 
    else if (password.value == "") {
        showError(password, "Enter Password*");
        return false;
    } else if (password.value.length < 8) {
        showError(password, "At least 8 characters in Password");
        return false;
    } else if (cPassword.value == "") {
        showError(cPassword, "Enter Confirm Password*");
        return false;
    } else if (password.value !== cPassword.value) {
        showError(cPassword, "Password doesn't match");
        return false;
    } else {
        
        return true;
    }
}

function clearError(input) {
    
    input.style.borderColor = "";
    
    var icon = input.nextElementSibling;
    if (icon) {
        icon.style.color = "";
    }
    
    var result = document.getElementById("result");
    if (result) {
        result.innerHTML = "";
    }
}

function showError(input, message) {
    const result = document.getElementById('result');
    result.innerHTML = message;
    result.style.color = "red";
    const inputParent = input.parentNode;
    inputParent.style.borderColor = "red";    
    const icon = input.nextElementSibling;
    if (icon) {
        icon.style.color = "red";
    }
    input.addEventListener('focus', () => {
        inputParent.style.borderColor = ""; 
        if (icon) {
            icon.style.color = ""; 
        }
    });

    if (icon) {
        icon.addEventListener('click', () => {
            input.focus(); 
            inputParent.style.borderColor = ""; 
            icon.style.color = ""; 
            
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[name="Formfill"]');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        if (validation()) {
            const formData = new FormData(form); // Create FormData object
            
            // Send form data using AJAX
            fetch('/signup', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Parse response as JSON
            .then(data => {
                if (data.error) {
                    // Handle error response (username exists)
                    alert(data.error);
                    window.location.reload();
                } else {
                    console.log(data);
                    // Handle success response (user registered successfully)
                    const popup = document.getElementById('popup');
                    popup.classList.add('open-slide');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});









