document.addEventListener('DOMContentLoaded', () => {
    const inputFields = document.querySelectorAll('input');
    const icons = document.querySelectorAll('.input-box i');
    
    inputFields.forEach((input, index) => {
        if (input.value !== "") {
            if(icons[index])
            icons[index].style.color = 'green';
            if(input.nextElementSibling){
                input.nextElementSibling.style.display = 'none'; 
            }
        }

        input.addEventListener('focus', () => {
            if(icons[index])
            icons[index].style.color = 'green';
        });

        input.addEventListener('blur', () => {
            if(icons[index])
            icons[index].style.color = 'white';
        });

        input.addEventListener('input', () => {
            if (input.value !== "") {
                input.nextElementSibling.style.display = 'none';
            } else {
                input.nextElementSibling.style.display = ''; 
            }
        });
    });

    // 
    const form = document.querySelector('form[name="ForgotPasswordForm"]');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (sendVerificationCode()) {
        showLoadingModal();
        fetch('/forgotpassword', {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                closeModal();
                // alert(data.success);
                showSuccess(data.success);
                console.log(data.success);
                // window.location.href = "/verify/"+data.user;
    
            } else if (data.error) {
                // Show error message
                closeModal()
                showError(document.ForgotPasswordForm.Username, data.error);
            }
            
        })
        .catch(error => {
            closeModal()
            console.error('Error:', error);
        });
       
    }
    // console.log('Form submission cancelled.');
    // console.log('Form submission cancelled.');
});

    // 

    icons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            inputFields[index].focus();
        });
    });
});

function sendVerificationCode() {
    const username = document.ForgotPasswordForm.Username;
    const email = document.ForgotPasswordForm.Email;

    clearError(username);
    clearError(email);

    if (username.value == "") {
        showError(username, "Enter Username*");
        return false;
    } else if (email.value == "") {
        showError(email, "Enter Email*");
        return false;
    } else {
        
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
    const result = document.getElementById('result');
    result.innerHTML = message;
    result.style.color = "red";
    const inputParent = input.parentNode;
    inputParent.style.borderColor = "red";    
    const icon = input.nextElementSibling;
    console.log("input")
    console.log(input);
    console.log("icon") 
    console.log(icon);
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



function showLoadingModal() {
    var modal = document.getElementById('loadingModal');
    modal.style.display = 'block';
    modal.classList.add('fade-in'); // Add fade-in animation
}
 // Function to close the modal
function closeModal() {
var modal = document.getElementById('loadingModal');
modal.style.display = 'none';
}

function showSuccess(message) {
    var successElement = document.getElementById("successAlert");
    var titleElement = successElement.querySelector(".success__title");
    titleElement.textContent = message;
    successElement.style.display = "flex";
}

function hideSuccess() {
    var successElement = document.getElementById("successAlert");
    successElement.style.display = "none";
    window.location.href="/login"
}

// Close button event listener
document.querySelector(".success__close").addEventListener("click", hideSuccess);
// Other JavaScript code for your form interactions can go here