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

    const form = document.querySelector('form[name="VerificationForm"]');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (verifyCode()) {
            // Add AJAX request to handle response
            fetch('/verify', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    alert(data.success);
                    console.log(data.success);
                    // Redirect the user to another page
                    window.location.href = "/user/upload";
                } else if (data.error) {
                    // Show error message
                    showError(document.VerificationForm.VerificationCode, data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    icons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            inputFields[index].focus();
        });
    });
});

function verifyCode() {
    const verificationCode = document.VerificationForm.VerificationCode;
    clearError(verificationCode);

    if (verificationCode.value == "") {
        showError(verificationCode, "Enter Verification Code*");
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
