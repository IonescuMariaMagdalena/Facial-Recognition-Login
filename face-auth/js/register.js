const register = {
    registerStream: null,
    
    startRegister: async function() {
        const userName = document.getElementById('userName').value.trim();
        if (!userName) {
            showMessage('registerMessage', 'Introduceți un nume de utilizator.', 'error');
            return;
        }
        
        if (faceDescriptors[userName]) {
            showMessage('registerMessage', 'Acest nume de utilizator este deja înregistrat.', 'error');
            return;
        }
        
        try {
            this.registerStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.getElementById('registerVideo');
            video.srcObject = this.registerStream;
            document.getElementById('captureFace').disabled = false;
            document.getElementById('startRegister').disabled = true;
            showMessage('registerMessage', 'Camera pornită. Poziționați-vă fața în cadru și apăsați "Salvare Față".', 'success');
        } catch (error) {
            console.error('Eroare la accesarea camerei:', error);
            showMessage('registerMessage', 'Eroare la accesarea camerei: ' + error.message, 'error');
        }
    },
    
    stopRegisterCamera: function() {
        if (this.registerStream) {
            this.registerStream.getTracks().forEach(track => track.stop());
            const video = document.getElementById('registerVideo');
            video.srcObject = null;
            document.getElementById('captureFace').disabled = true;
            document.getElementById('startRegister').disabled = false;
        }
    },
    
    captureFace: async function() {
        const video = document.getElementById('registerVideo');
        const userName = document.getElementById('userName').value.trim();
        const messageElement = document.getElementById('registerMessage');
        
        try {
            // Detectăm fața
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();
            
            if (detections.length === 0) {
                showMessage('registerMessage', 'Nu s-a detectat nicio față.', 'error');
                return;
            }
            
            if (detections.length > 1) {
                showMessage('registerMessage', 'S-a detectat mai mult de o față. Asigurați-vă că sunteți singur în cadru.', 'error');
                return;
            }
            
            // Salvăm descriptorul feței
            faceDescriptors[userName] = Array.from(detections[0].descriptor);
            localStorage.setItem('faceDescriptors', JSON.stringify(faceDescriptors));
            
            showMessage('registerMessage', `Fața a fost salvată cu succes pentru utilizatorul ${userName}.`, 'success');
            document.getElementById('userName').value = '';
            this.stopRegisterCamera();
        } catch (error) {
            console.error('Eroare la capturarea feței:', error);
            showMessage('registerMessage', 'Eroare la capturarea feței: ' + error.message, 'error');
        }
    }
};

// Oprim camera când se închide tab-ul
document.getElementById('registerTab').addEventListener('click', function() {
    if (!this.classList.contains('active')) {
        register.stopRegisterCamera();
    }
});