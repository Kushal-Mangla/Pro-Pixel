const inputFields = document.querySelectorAll('input');
const icons = document.querySelectorAll('.input-box i');

document.addEventListener('DOMContentLoaded', () => {
    
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
            if (input.value !== "") {
                if(input.nextElementSibling)
                input.nextElementSibling.style.display = 'none';
            }
            // 
        });

        input.addEventListener('input', () => {
            if (input.value !== "") {
                if(input.nextElementSibling)
                input.nextElementSibling.style.display = 'none'; 
            } else {
                if(input.nextElementSibling)
                input.nextElementSibling.style.display = ''; 
            }
        });
    });
   
});


document.addEventListener('DOMContentLoaded', () => {
    const inputFields = document.querySelectorAll('input');
    const icons = document.querySelectorAll('.input-box i');
    icons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            inputFields[index].focus();
        });
    });
});


