// Variabile și funcții globale
let faceDescriptors = {};

// Încărcăm modelele face-api.js
async function loadModels() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        console.log('Modele încărcate cu succes');
        
        // Încărcăm fețele salvate din localStorage
        const savedFaces = localStorage.getItem('faceDescriptors');
        if (savedFaces) {
            faceDescriptors = JSON.parse(savedFaces);
        }
    } catch (error) {
        console.error('Eroare la încărcarea modelelor:', error);
    }
}

// Funcții pentru tab-uri
function openTab(tabName) {
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    document.getElementById(tabName).classList.add('active');
}

// Funcție utilitară pentru afișarea mesajelor
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Ascundem mesajul după 5 secunde
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Inițializare la încărcarea paginii
window.onload = function() {
    loadModels();
};