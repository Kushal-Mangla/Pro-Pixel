// const maxPhotos = 10;

// let selectedPhotos = [];

// function addPhotoToTimeline(photoSrc) {
//     if (selectedPhotos.length < maxPhotos) {
//         const photoTimeline = document.getElementById('photoTimeline');
//         const img = document.createElement('img');
//         img.src = photoSrc;
//         img.addEventListener('click', () => {
//             setDuration(img);
//         });
//         photoTimeline.appendChild(img);
//         selectedPhotos.push({ src: photoSrc, duration: 5 }); 
//     } else {
//         alert(`Maximum of ${maxPhotos} photos reached.`);
//     }
// }

// function setDuration(img) {
//     const durationSlider = document.querySelector('.durationSlider');
//     const durationValue = document.querySelector('.durationValue');
//     const index = Array.from(img.parentNode.children).indexOf(img);
//     const photo = selectedPhotos[index];
    
//     durationSlider.value = photo.duration;
//     durationValue.textContent = photo.duration;
    
//     durationSlider.addEventListener('input', () => {
//         photo.duration = parseInt(durationSlider.value);
//         durationValue.textContent = durationSlider.value; 
//     });
// }

// function handleTransitionOptions() {
//     const transitionSelect = document.querySelector('.transitionSelect');
//     const selectedTransition = transitionSelect.value;
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const selectedPhotoPaths = [];
//     for (let i = 1; i <= maxPhotos; i++) {
//         selectedPhotoPaths.push(`/static/img${i}.jpg`);
//         // selectedPhotoPaths.push(`{{ ('static', filename='img${i}') }}`);

//     }
//     selectedPhotoPaths.forEach(photoPath => {
//         addPhotoToTimeline(photoPath);
//     });
    
//     const photoTimelines = document.querySelectorAll('.photo-timeline img');
//     photoTimelines.forEach((photo, index) => {
//         photo.addEventListener('click', () => {
//             const durationSlider = document.querySelector('.durationSlider');
//             const durationValue = document.querySelector('.durationValue');
//             const selectedPhoto = selectedPhotos[index];
//             durationSlider.value = selectedPhoto.duration;
//             durationValue.textContent = selectedPhoto.duration;
//         });
//     });
// });
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

var audioTrack = WaveSurfer.create({
    container: ".audio",
    waveColor: "#eee",
    progressColor: "red",
    barWidth: 2,
});
document.addEventListener("DOMContentLoaded", function() {
    const timerDisplay = document.querySelector(".timer"); // Select the timer display element


    // audioTrack.load("/static/CrashAndBurn.mp3");
    audioTrack.on('audioprocess', function() { // Use 'audioprocess' event to continuously update the timer

        const currentTime = formatTime(audioTrack.getCurrentTime()); // Get current time from WaveSurfer
        const duration = formatTime(audioTrack.getDuration()); // Get total duration from WaveSurfer

        console.log(`${currentTime} / ${duration}`);
        timerDisplay.textContent = `${currentTime} / ${duration}`; // Update the timer display
    });

});
const playBtn = document.querySelector(".play-btn");
const stopBtn = document.querySelector(".stop-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
 
  playBtn.addEventListener("click", () => {
    audioTrack.playPause();
  
    if (audioTrack.isPlaying()) {
      playBtn.classList.add("playing");
    } else {
      playBtn.classList.remove("playing");
    }
  });
  
  stopBtn.addEventListener("click", () => {
    audioTrack.stop();
    playBtn.classList.remove("playing");
  });
  
  volumeSlider.addEventListener("mouseup", () => {
    changeVolume(volumeSlider.value);
  });
  
  const changeVolume = (volume) => {
    if (volume == 0) {
      muteBtn.classList.add("muted");
    } else {
      muteBtn.classList.remove("muted");
    }
  
    audioTrack.setVolume(volume);
  };
  
  muteBtn.addEventListener("click", () => {
    if (muteBtn.classList.contains("muted")) {
      muteBtn.classList.remove("muted");
      audioTrack.setVolume(0.5);
      volumeSlider.value = 0.5;
    } else {
      audioTrack.setVolume(0);
      muteBtn.classList.add("muted");
      volumeSlider.value = 0;
    }
  });







const nav=document.querySelector(".navigation");

const  searchBox =nav.firstElementChild.nextElementSibling
const searchBoxIcon=searchBox.firstElementChild.nextElementSibling;
const searchBoxInput=searchBox.firstElementChild;
searchBoxIcon.addEventListener("click",()=>{
    searchBoxInput.value="";
    const checkBox=document.querySelector("#pc");
        if(checkBox.checked===true){
            pcLabel.click();
        }
        const checkBox1=document.querySelector("#pc1");
        if(checkBox1.checked===true){
            pcLabel1.click();
        }
        const checkBox2=document.querySelector("#pc2");
        if(checkBox2.checked===true){
            pcLabel2.click();
        }
});
searchBoxInput.addEventListener("input",(event)=>{
    if(searchBoxInput.value===""){
        drop.childNodes.forEach((el)=>{
            if(el.nodeName==="LI"){
                el.style.display="flex";
            }
        });
        drop1.childNodes.forEach((el)=>{
            if(el.nodeName==="LI"){
                el.style.display="flex";
            }
        });
        return;
    }
    const checkBox=document.querySelector("#pc");
    if(checkBox.checked===false){
        pcLabel.click();
    }
    const checkBox1=document.querySelector("#pc1");
    drop1.childNodes.forEach((el)=>{
        if(el.nodeName==="LI"){
            const text= el.firstElementChild.nextElementSibling.innerHTML;
            console.log(text);
            if(text.toLowerCase().indexOf(searchBoxInput.value.toLowerCase())>-1){
                el.style.display="flex";
            }
            else{

                el.style.display="none";
            }
        }
        
    });
    
    if(checkBox1.checked===false){
        pcLabel1.click();
    }
    drop.childNodes.forEach((el)=>{
        
        if(el.nodeName==="LI"){
            const text= el.firstElementChild.nextElementSibling.innerHTML;
            console.log(text);
            if(text.toLowerCase().indexOf(searchBoxInput.value.toLowerCase())>-1){
                el.style.display="flex";
            }
            else{
                el.style.display="none";
            }
        }
    });
    
});
var kushal = nav.firstElementChild.innerHTML;
nav.firstElementChild.addEventListener("click",()=>{
    if(nav.firstElementChild.innerHTML==="arrow_back"){
        const left=document.querySelector(".left");
        nav.firstElementChild.innerHTML="dashboard";
        nav.firstElementChild.nextElementSibling.style.display="none";
        nav.nextElementSibling.style.display="none";
        left.style.transition="width 0.5s";
        left.style.width="50px";
        searchBoxInput.value="";
    }
    else if(nav.firstElementChild.innerHTML==="dashboard"){
        const left=document.querySelector(".left");
        left.style.transition = "width 0.0s ease-in-out";
        left.style.width="250px";
        kushal = "arrow_back"
        nav.firstElementChild.innerHTML="arrow_back";
        nav.firstElementChild.nextElementSibling.style.display="flex";
        nav.nextElementSibling.style.display="block";
        const checkBox=document.querySelector("#pc");
        const checkBox1=document.querySelector("#pc1");
        if(checkBox.checked===true){
            pcLabel.click();
        }
        if(checkBox1.checked===true){
            pcLabel1.click();
        }
        const checkBox2=document.querySelector("#pc2");
        if(checkBox2.checked===true){
            pcLabel2.click();
        }
    }
});
const drop=document.querySelector("#drop");
const pcLabel=document.querySelector("#pcLabel");
pcLabel.addEventListener("click",()=>{
    if(drop.style.overflowY==="scroll"){
        drop.style.overflowY="hidden";
    }
    else
    drop.style.overflowY="scroll";
});
const pcLabel1=document.querySelector("#pcLabel1");
const drop1=document.querySelector("#drop1");
const pcLabel2=document.querySelector("#pcLabel2");
const drop2=document.querySelector("#drop2");
pcLabel2.addEventListener("click",()=>{
    if(drop2.style.overflowY==="scroll"){
        drop2.style.overflowY="hidden";
    }
    else
    drop2.style.overflowY="scroll";
});
pcLabel1.addEventListener("click",()=>{
    if(drop1.style.overflowY==="scroll"){
        drop1.style.overflowY="hidden";
    }
    else
    drop1.style.overflowY="scroll";
});
drop2.childNodes.forEach((el)=>{
    if(el.nodeName==="LI"){
        el.addEventListener("click",()=>{
            for(let i=0;i<drop2.childNodes.length;i++){
                if(drop2.childNodes[i].nodeName==="LI"){
                    drop2.childNodes[i].classList.remove("active");
                }
            }
            el.classList.add("active");
        });
    }
});
drop1.childNodes.forEach((el)=>{
    if(el.nodeName==="LI"){
        el.addEventListener("click",()=>{
            for(let i=0;i<drop1.childNodes.length;i++){
                if(drop1.childNodes[i].nodeName==="LI"){
                    drop1.childNodes[i].classList.remove("active");
                }
            }
            el.classList.add("active");
        });
    }
});
imagesList=[];
// image list is used to store the the data 
drop.childNodes.forEach((el)=>{
    if(el.nodeName==="LI"){
        el.addEventListener("dblclick",()=>{
            imagesList.push(el);
            console.log(imagesList);
            const timeline=document.querySelector("#photoTimeline");
            const outerDiv=document.createElement("div");
            const img=document.createElement("img");
            img.src="data:image/jpeg;base64,"+el.lastElementChild.innerHTML;
            img.style.width="100px";
            img.style.height="100px";
            // img.style.margin="10px";
            img.style.borderRadius="10px";
            img.style.objectFit="cover";
            // img.style.position="relative";
            img.style.display="inline-block";
            img.style.cursor="pointer";
            img.addEventListener("mouseover",()=>{
                cross.style.display="block";
            });
            const cross=document.createElement("div");
            cross.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707 5.354 11.354a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>`;
            cross.style.position="absolute";
            cross.style.top="0";
            cross.style.right="0";
            cross.style.display="none";
            cross.style.backgroundColor="white";
            cross.style.padding="5px";
            cross.style.cursor="pointer";
            cross.addEventListener("click",()=>{
                outerDiv.remove();
                imagesList.splice(imagesList.indexOf(el),1);
            });
            cross.addEventListener("mouseover",()=>{
                cross.style.display="block";
            });
            img.addEventListener("mouseout",()=>{
                cross.style.display="none";
            });
            outerDiv.style.position="relative";
            outerDiv.style.display="inline-block";
            outerDiv.style.margin="10px";
            outerDiv.style.width="100px";
            outerDiv.style.height="120px";
            const durationInput=document.createElement("input");
            durationInput.type="number";
            durationInput.value=5;
            durationInput.min=1;
            durationInput.max=10;
            durationInput.addEventListener("change",()=>{
                el.dataset.duration=durationInput.value;
            });
            durationInput.style.width="100px";
            durationInput.style.height="20px";
            
            durationInput.style.backgroundColor="#f2f2f2";
            durationInput.style.border="none";
            durationInput.style.textAlign="center";
            durationInput.style.borderRadius="10px";
            // durationInput.style.display="none";
            
            outerDiv.appendChild(img);
            outerDiv.appendChild(durationInput);
            outerDiv.appendChild(cross);
            outerDiv.classList.add("outerDiv");
            timeline.appendChild(outerDiv);
        });
    }
});
let audioUrl;
let audioName ;
// Select all the list items in #drop2
let listItems = document.querySelectorAll("#drop2 li");
var audio_selector = 0;
// Add an event listener to each list item
listItems.forEach((li) => {
    li.addEventListener("dblclick", () => {
        // Get the name of the audio track
        audioName = li.querySelector("p").textContent.trim();
        const trackName = document.querySelector(".track-name");
        trackName.textContent = audioName;
        // Load the audio file (replace with the actual URL or file path)
        let audioUrl = `/static/${audioName.trim()}.mp3`;
        audio_selector = 1;
        audioTrack.load(audioUrl);
    });
});

let blobUrl ;
// Get all the li elements
var audioItems = document.querySelectorAll('#drop1 li');

// Loop through each li element and attach event listener
audioItems.forEach(function(audioItem) {
    // Add event listener for double click
    audioItem.addEventListener('dblclick', function() {
        const audio_name= audioItem.querySelector(".name-audio").textContent;
        const blob = audioItem.querySelector(".blob").textContent;
        blobUrl ="data:audio/mpeg;base64,"+blob;
        audio_selector = 2;
        const trackName= document.querySelector(".track-name");
        
        trackName.innerHTML= audio_name ;      

        // console.log(blobUrl);
        audioTrack.load(blobUrl);

        // console.log(id)
       
    });
});

let startTimeInput = document.querySelector("#start-time");
let endTimeInput = document.querySelector("#end-time");
let updateTimerButton = document.querySelector("#update-timer");

// Create an AudioContext
let audioContext = new AudioContext();

// Variable to store the AudioBufferSourceNode
let source;
function parseTime(timeString) {
    let [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
}
const user = document.querySelector("#user").innerHTML;
updateTimerButton.addEventListener("click", () => {
    // Parse the start and end times
    if(startTimeInput.value==="" || endTimeInput.value===""){
        showAlert("Please enter the start and end time");
        return;
    }
    let startTime = parseTime(startTimeInput.value);
    let endTime = parseTime(endTimeInput.value);
    
    if(startTime>=endTime){
        showAlert("Start time should be less than end time");
        return;
    }
    
    showLoadingModal();
    // Load the audio file (replace with the actual URL or file path)
    // let audioUrl = `/static/preloaded_audio/${audioName}.mp3`;
    // audioUrl = `/static/${audioName.trim()}.mp3`;
    if (audio_selector==0) {
        showAlert('Please select an audio track');
        closeModal();
        return;
    }
    let audioUrl
    if(audio_selector==1)
    {
        audioUrl = `static/${audioName.trim()}.mp3`;
    }
    else if(audio_selector==2)
    {
        audioUrl = blobUrl
    }
    // Send the start time, end time, and audio URL to the Flask server
    fetch(`/trim_audio/${user}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            startTime: startTime,
            endTime: endTime,
            audioUrl: audioUrl
        })
    }).then((response) => response.
    json()).then((data) => {
        closeModal();
        showSuccess("Trimmed Audio Successfully");
        console.log(data)
    }).catch((error) => {
        console.error('Error:', error);
        closeModal();
        showAlert('An error occurred while trimming the audio');
    });
    // Load the audio file (replace with the actual URL or file path)
});


const saveOrderBtn = document.querySelector("#saveOrderButton");
saveOrderBtn.addEventListener("click", () => {
    // alert("Please wait while we make your slideshow");
    const timeline = document.querySelector("#photoTimeline");
    const images = timeline.querySelectorAll(".outerDiv");
    const imageList = [];
    showLoadingModal();
    images.forEach((el) => {
        if (el.nodeName === "DIV") {
            // Get the image source and duration from the dataset
            const src = el.firstElementChild.src;
            const num = Number(el.firstElementChild.nextElementSibling.value);
            const duration = num || 5; // Default duration
            // Add the image source and duration to the list
            console.log(duration);
            imageList.push({ src, duration });
        }
    });
    // Send the imageList to the server using the fetch API
    const user = document.querySelector("#user").innerHTML;
    console.log(user);


    // let transitionType = button.textContent.trim(); // Get the text content of the button

    
    fetch(`/saveOrder/${user}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            videoPath : `static/video/${user}_video.mp4` , 
            imageList: imageList,
            transitionType: "fade",
            
            // transitionType: transitionType,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to save slideshow');
            }
            closeModal();
            return res.json();
        })
        .then((data) => {
            // closeModal();
            showSuccess("Congratulations! Your slideshow is ready");
            // alert("Congratulations! Your slideshow is ready");
            console.log(data);
            // Handle the response data as needed
        })
        .catch((error) => {
            console.error('Error:', error);
            closeModal();
            showAlert('An error occurred while saving the slideshow');
            // alert('An error occurred while saving the slideshow');
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
    
    const transitionButtons = document.querySelectorAll('.button-container button');
    transitionButtons.forEach(button => {
        button.addEventListener('click', () => {
            let transitionType = button.textContent.trim(); // Get the text content of the button
            console.log("reached");
            applyTransition(transitionType);
        });
    });
    });
    
    function applyTransition(transitionType) {
        showLoadingModal();
    const timeline = document.querySelector("#photoTimeline");
    const images = timeline.querySelectorAll(".outerDiv");
    const imageList = [];
    images.forEach((el) => {
        if (el.nodeName === "DIV") {
            // Get the image source and duration from the dataset
            const src = el.firstElementChild.src;
            const num = Number(el.firstElementChild.nextElementSibling.value);
            const duration = num || 5; // Default duration
            // Add the image source and duration to the list
            console.log(duration);
            imageList.push({ src, duration });
        }
    });
    // Send the imageList to the server using the fetch API
    const user = document.querySelector("#user").innerHTML;
    console.log(user);
    console.log(imageList);
    
    // Send a request to the server to apply the transition
    // const user = document.querySelector(".profile").lastElementChild.innerHTML;
    fetch(`/applyTransition/${user}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            videoPath : `static/video/${user}_video.mp4` ,
            imageList: imageList, 
            transitionType: transitionType,
        }),
    })
    .then((res) => {
        if (!res.ok) {
            closeModal();
            showAlert('An error occurred while applying the transition');
            throw new Error('Failed to apply transition');
        }
        return res.json();
    })
    .then((data) => {
        closeModal();
        showSuccess(data.success);
        // alert(data.success); // Display a success message or do any further processing
        console.log(data);
        // Handle the response data as needed
    })
    .catch((error) => {
        closeModal();
        console.error('Error:', error);
        showAlert('An error occurred while applying the transition');
        // alert('An error occurred while applying the transition');
    });
    }

    document.addEventListener('click', function(event) {
        var leftDiv = document.querySelector('.left');
        var materialIcons = document.querySelector('.material-icons');
        
        // Check if the clicked element is not within the left div
        if (kushal==="arrow_back" && !leftDiv.contains(event.target)) {
            // Programmatically trigger click event on material-icons element
            materialIcons.click();
            kushal = "dashboard";
        }
    });
    



    const deleteBtn = document.querySelector("#deletemusic");
    deleteBtn.addEventListener("click", () => {
        const user = document.querySelector("#user").innerHTML;
        showLoadingModal();
        fetch(`/deleteMusic/${user}`, {
            method: "POST",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete music');
                }
                closeModal();
                return res.json();
            })
            .then((data) => {
                closeModal();
                showSuccess("Music deleted successfully");
                // alert('Music deleted successfully');
                console.log(data);
                // Handle the response data as needed
            })
            .catch((error) => {
                console.error('Error:', error);
                closeModal();
                showAlert('An error occurred while deleting the music');
                // alert('An error occurred while deleting the music');
            });
    });
    
function setResolution(resolution) {
    console.log("Selected Resolution:", resolution);
    const user = document.querySelector("#user").innerHTML;
    const resolutionString = resolution.toString(); // Convert resolution to string
    fetch(`/downloadVideo/${user}/${resolutionString}`, {
        method: "GET"
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to download video');
        }
        return response.blob();
    })
    .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${user}_video_${resolutionString}p.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while downloading the video');
    });
}
   
    
    function closePopup() {
        document.getElementById('resolutionPopup').style.display = 'none';
    }

    function deleteVideo(){
        const user=document.querySelector("#user").innerHTML;
        // showLoadingModal();
        fetch(`/deleteVideo/${user}`, {
            method: "POST",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete video');
                }
                // closeModal();
                return res.json();
            })
            .then((data) => {
                // closeModal();
                showSuccess("Thank you for using our service");
                // alert('Video deleted successfully');
                console.log(data);
                // Handle the response data as needed
            })
            .catch((error) => {
                console.error('Error:', error);
                // closeModal();
                showAlert('kindly refresh the page and try again');
                // alert('An error occurred while deleting the video');
            });
    }