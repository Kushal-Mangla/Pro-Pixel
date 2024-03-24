const wallpapers = ['static/bg1.jpg', 'static/bg2.jpg', 'static/bg3.jpg', 'static/bg4.jpg', 'static/bg5.jpg', 'static/bg6.jpg', 'static/bg7.jpg', 'static/bg8.jpg'];
let currentWallpaperIndex = 0;

updateBackgroundAutomaticallyafter5seconds();

const circles = document.querySelectorAll('.circle');
circles.forEach((circle, index) => {
    circle.addEventListener('click', () => {
        currentWallpaperIndex = index;
        updateBackground();
        updatePagination();
    });
});

document.querySelector('.right-arrow').addEventListener('click', () => {
    currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
    updateBackground();
    updatePagination();
});

document.querySelector('.left-arrow').addEventListener('click', () => {
    currentWallpaperIndex = (currentWallpaperIndex - 1 + wallpapers.length) % wallpapers.length;
    updateBackground();
    updatePagination();
});

function updateBackground() {
    const card1 = document.querySelector('.card-1');
    const textOfCard1 = document.querySelector('.textofcard1');
    const NAV = document.querySelector('.nav-links li');
    
    card1.style.backgroundImage = `url(${wallpapers[currentWallpaperIndex]})`;
    
    if (currentWallpaperIndex === 4) {
        textOfCard1.style.color = 'white'; 
        NAV.style.color = 'white';  
        
    } else {
        textOfCard1.style.color = 'black'; 
    }
}

function updatePagination() {
    circles.forEach((circle, index) => {
        if (index === currentWallpaperIndex) {
            circle.classList.add('active');
        } else {
            circle.classList.remove('active');
        }
    });
}

function updateBackgroundAutomaticallyafter5seconds(){
    setInterval(() => {
        currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
        updateBackground();
        updatePagination();
    }, 2500);
}

// popup.js
document.getElementById('openPopupBtn').addEventListener('click', function() {
    document.getElementById('popupContainer').style.display = 'block';
});

document.getElementById('closePopupBtn').addEventListener('click', function() {
    document.getElementById('popupContainer').style.display = 'none';
});
