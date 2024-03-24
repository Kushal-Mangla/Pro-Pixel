document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selectAudio').addEventListener('click', function () {
        const audioInput = document.getElementById('audioInput');
        audioInput.click();
    });
  
    document.getElementById('audioInput').addEventListener('change', function () {
        const selectedFile = this.files[0];
        const selectedFileNameElement = document.getElementById('selected-audio-name');
        if (selectedFile) {
            selectedFileNameElement.textContent = selectedFile.name;
        } else {
            selectedFileNameElement.textContent = 'No audio selected';
        }
    });
  });
  
  // drag-drop multiple Images for uploading images and previewing them and sending them to the server
  // to save the files that users upload in multipl process of clicking the dropzone and selecting the files
  // we need to store the files in a variable and then send them to the server so use a glabal List to store the files
  let files=[];
  const uploadForm=document.querySelector('#uploadForm');
  const fileInput=document.querySelector('#fileInput');
  const dropZone=document.querySelector('#drop-area');
  const selectFileButton=document.querySelector('#selectFileButton');
  // No need of this button as dropZone already triggers the fileInput.click() event
  // selectFileButton.addEventListener('click',()=>{
  //     console.log('clicked on select file button');
  //     fileInput.click();
  // });
  dropZone.addEventListener('click',()=>{
      console.log('clicked on drop zone');
      fileInput.click();
  });
  dropZone.addEventListener('dragover', (e)=>{
      // console.log('File is over the drop zone');
      e.preventDefault();
  
      // the default action of the dragover event is to not allow dropping
      // we need to prevent that
      dropZone.style.backgroundColor='rgba(33, 150, 243, 0.3)';
      // dropZone.style.boxShadow='0 0 5px 2px #888888';
      dropZone.style.border='2px dashed #2196f3';
      // console.log(dropZone.classList);
  
  });
  dropZone.addEventListener('dragleave', (e)=>{
      // console.log('File left the drop zone');
      e.preventDefault();
      dropZone.style.border='2px dashed white';
      dropZone.style.boxShadow='none';
      dropZone.style.backgroundColor='#121212';
      
  
  });
  // either a user can select the files or drop the files on the drop zone
  // so we need to handle both the cases
  // drop event is triggered when the files are dropped on the drop zone but clicking on open file will trigger the change event too
  // so in case of drag and drop we need to check if the files are dropped or not because both events will be triggered so only one should be handled
  // so we need to prevent the default action of the drop event
  flag=false;
  dropZone.addEventListener('drop', (e)=>{
      // the default action of the drop event is to open the file in the browser
      e.preventDefault();
      
      dropZone.style.border='2px dashed white';
      dropZone.style.boxShadow='none';
      dropZone.style.backgroundColor='#121212';
      console.log('File dropped on the drop zone');
      // files is a global variable list append the new files to it
      // e.dataTransfer.files is a FileList object which is similar to an array
      // files=e.dataTransfer.files; // e.dataTransfer.files is a FileList object which is similar to an array
      files=[...files,...e.dataTransfer.files];
      flag=true;
      // console.log(files);
      handleFiles(e.dataTransfer.files); 
  });
  
  
  // function to handle the files and display them in the drop zone
  // change event listner is basically used to listen to the change in the input field and then do something
  // in this case we are listening to the change in the file input field and then we are getting the files and then
  // displaying them in the drop zone using the handleFiles function the change is measured from a file being selected
  fileInput.addEventListener('change',()=>{
      // console.log('File selected');
      if (flag){
          flag=false;
          return;
      }
      // files is a global variable list append the new files to it
      files=[...files,...fileInput.files];
      // console.log(files);
      handleFiles(fileInput.files); // this function will handle the files and display them in the drop zone
  });
  // function to handle the files and display them in the drop zone
  const previewArea=document.getElementsByClassName('images')[0];
  function handleFiles(files){    
      for (let i=0;i<files.length;i++){
          const img=document.createElement('img');
          img.src=URL.createObjectURL(files[i]);
          img.style.width='100px';
          img.style.height='100px';
          img.style.borderRadius='10px';
          img.style.objectFit='cover';
          // create a child div and append image and cross both to it
          const childDiv=document.createElement('div');
          // childDiv.addclassName='childDiv';
          childDiv.style.position='relative';
          childDiv.style.display='inline-block';
          childDiv.style.margin='10px';
          childDiv.appendChild(img);
          // store the index of the file in the img element so that we can remove the file from the files list when the cross is clicked
          img.index=i;
          const cross=document.createElement('div');
          // cross.addclassName='cross';
          cross.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707 5.354 11.354a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>`;
          cross.style.position='absolute';
          cross.style.top='0';
          cross.style.right='0';
          cross.style.display='none';
          cross.style.backgroundColor='white';
          cross.style.padding='5px';
          cross.style.cursor='pointer';
  
          img.addEventListener('mouseover',()=>{
              cross.style.display='block';
          });
          cross.addEventListener('mouseover',()=>{
              cross.style.display='block';
          });
          img.addEventListener('mouseout',()=>{
              cross.style.display='none';
          });
          childDiv.appendChild(cross);
          previewArea.appendChild(childDiv);
      }
  }
  
  previewArea.addEventListener('click',(e)=>{
      console.log(e.target.tagName)
      if (e.target.tagName==='DIV'){
          console.log('clicked on cross');
          console.log(e.target.parentElement.firstChild.index)
          files.splice(e.target.parentElement.firstChild.index,1);
          if(e.target.parentElement.firstChild.index!==undefined){
              e.target.parentElement.remove();
          }
      }
      else if(e.target.tagName==='svg'){
          console.log('clicked on svg');
          files.splice(e.target.parentElement.parentElement.firstChild.index,1);
          e.target.parentElement.parentElement.remove();
      }
      else if(e.target.tagName==='path'){
          console.log('clicked on path');
          files.splice(e.target.parentElement.parentElement.parentElement.firstChild.index,1);
          e.target.parentElement.parentElement.parentElement.remove();
      }
  });
  
  
  
const user=document.querySelector('#user').textContent;
  const submitButton=document.querySelector('#uploadButton');
  submitButton.addEventListener('click',()=>{
        console.log('clicked on submit button');
        showLoadingModal();
        const formData=new FormData();
        for (let i=0;i<files.length;i++){
            console.log(files[i]);
            try{
                formData.append('files',files[i]);
            }
            catch(error){
                console.log(error);
            }
        }
        console.log(formData.getAll('files')); // formData is an empty {} object but we have appended the files to it
        
        
        // send the files to the server
        // fetch is a promise based function
        let url=window.location.href;
        fetch(window.location.href,{
            method:'POST',
            body:formData
        }).then(response=>response.json())
        .then(data=>{
                if(data.message){
                    // window.alert(data.message);
                    showSuccess(data.message)

                }
                else if(data.error){
                    showAlert(data.error)
                    // window.alert(data.error);
                }
                closeModal();
                console.log(data);
                files=[];
                previewArea.innerHTML='';
        })
        .catch(error=>console.log(error));
    });

uploadForm.addEventListener('submit',(e)=>{
      console.log('clicked on submit button');
    //   console.log(e)
      e.preventDefault();
      showLoadingModal();
      const formData=new FormData();
      for (let i=0;i<files.length;i++){
          console.log(files[i]);
          try{
            formData.append('files',files[i]);
          }
          catch(error){
              console.log(error);
          }
      }
      console.log(formData.getAll('files')); // formData is an empty {} object but we have appended the files to it
      
      
      // send the files to the server
      // fetch is a promise based function
      fetch(window.href,{
          method:'POST',
          body:formData
      }).then(response=>response.json())
      .then(data=>{
            if(data.message){
                console.log(data.error)
            }
            closeModal();
            console.log(data);
            files=[];
            previewArea.innerHTML='';
      })
      .catch(error=>console.log(error));
    //   closeModal();
  });
const audioButton=document.querySelector('#uploadAudio');
audioButton.addEventListener('click',(e)=>{
    e.preventDefault();
    console.log('clicked on audio button');
    showLoadingModal();
    const formData=new FormData();
    formData.append('audio',document.querySelector('#audioInput').files[0]);
    fetch(window.location.href,{
        method:'POST',
        body:formData
    }).then(response=>response.json())
    .then(data=>{
        if(data.message){
            showSuccess(data.message)
            document.querySelector('#selected-audio-name').textContent='No audio selected';
            document.querySelector('#audioInput').value='';
        }
        else if(data.error){
            showAlert(data.error)
        }
        closeModal();
        console.log(data);
    })
    .catch(error=>console.log(error));
});
  
