function dropHandler(event) {
    event.preventDefault();

    if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === 'file') {
                const file = event.dataTransfer.items[i].getAsFile();
                displayImagePreview(file);
            }
        }
    }
}

function dragOverHandler(event) {
    event.preventDefault();
    document.getElementById('drop-box').classList.add('drag-over');
    document.getElementById('drop-box').style.border =  "2px dashed #b0b3b8";
}

function dragLeaveHandler(event) {
    event.preventDefault();
    document.getElementById('drop-box').classList.remove('drag-over');
    document.getElementById('drop-box').style.border =  "2px dashed #000";
}

function displayImagePreview(file) {
    const container = document.getElementById('image-container');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(file);
    imgElement.classList.add('img-preview');

    const deleteButton = document.createElement('div');
    deleteButton.innerHTML = '&times;'; // we have used '×' character for deletion interface
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function () {
        container.removeChild(imageWrapper);
    });

    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(deleteButton);

    container.appendChild(imageWrapper);
    document.getElementById('drop-box').classList.remove('drag-over');
}

// input add image , video , music

function selectFile(inputId) {

    document.getElementById(inputId).click();
}

function displaySelectedFile(inputId) {
    // Display the selected file name next to the corresponding button
    const fileInput = document.getElementById(inputId);
    const fileName = fileInput.value.split('\\').pop(); 
    const addButton = document.querySelector(`button[onclick="selectFile('${inputId}')"] .add_image`);
    addButton.textContent = fileName;

    // preview for the files uploaded through the buttons
    const file = fileInput.files[0];
    displayImagePreview(file);
}

// event listener to handle the upload button when it is clicked
document.getElementById('upload').addEventListener('click', function () {
    const imageInput = document.getElementById('imageInput');
    const musicInput = document.getElementById('musicInput'); 
    const videoInput = document.getElementById('videoInput');

    const selectedImage = imageInput.files[0];
    const selectedMusic = musicInput.files[0]; 
    const selectedVideo = videoInput.files[0];

    // You can perform upload logic here using the selected files
    // For demonstration, let's just log the file names
    console.log('Selected Image:', selectedImage ? selectedImage.name : 'None');
    console.log('Selected Music:', selectedMusic ? selectedMusic.name : 'None');
    console.log('Selected Video:', selectedVideo ? selectedVideo.name : 'None');
});

// dropdown on clicking user name

function toggleDropdown() {
    var dropdown = document.getElementById("myDropdown");
    dropdown.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.user-name')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};