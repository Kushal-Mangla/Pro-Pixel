Commands to give inorder to have the same local databse as the one which is on Inesh's computer in MySql Workbench

create database register;

use register;

CREATE TABLE user_audio (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  audio_file LONGBLOB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE user_images (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  image_data LONGBLOB,
  image_name VARCHAR(255),
  image_size INT,
  image_type VARCHAR(255),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

and then while running your script, use your id password and details instead.
```
 <!--  -->
  {% comment %} <script src="{{ url_for('static', filename='temp_drag_drop.js') }}"></script>
  <script>
    const dropArea = document.getElementById('drop-area');

    // Prevent default behavior (Prevent file from being opened)
    dropArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropArea.style.border = '2px dashed #212121'; // Highlight the drop area when a file is dragged over it
    });

    dropArea.addEventListener('dragleave', function () {
      dropArea.style.border = '2px dashed #ccc'; // Reset border when the file is dragged out
    });

    dropArea.addEventListener('drop', function (e) {
      e.preventDefault();
      dropArea.style.border = '2px dashed #ccc'; // Reset border when the file is dropped

      const fileInput = document.getElementById('fileInput');
      fileInput.files = e.dataTransfer.files;

      // Submit the form when file is dropped
      // document.getElementById('uploadForm').submit();
    });

    // Optional: Clicking on the drop area triggers the file input
    dropArea.addEventListener('click', function () {
      const fileInput = document.getElementById('fileInput');
      fileInput.click();
    });
  </script>
  <script>
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

    function handleFileSelection(files) {
      for (let i = 0; i < files.length; i++) {
        displayImagePreview(files[i]);
      }
    }

    function displayImagePreview(file) {
      const container = document.querySelector('.images');

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      const imgElement = document.createElement('img');
      imgElement.src = URL.createObjectURL(file);
      imgElement.alt = 'Uploaded Image';

      imageContainer.appendChild(imgElement);
      container.appendChild(imageContainer);
    }
  </script>
   {% endcomment %}
```