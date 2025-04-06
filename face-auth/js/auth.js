const auth = {
    loginStream: null,
    
    startLogin: async function() {
        try {
            this.loginStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.getElementById('loginVideo');
            video.srcObject = this.loginStream;
            document.getElementById('recognizeFace').disabled = false;
            document.getElementById('startLogin').disabled = true;
            showMessage('loginMessage', 'Camera pornită. Apăsați "Recunoaștere Față" pentru autentificare.', 'success');
        } catch (error) {
            console.error('Eroare la accesarea camerei:', error);
            showMessage('loginMessage', 'Eroare la accesarea camerei: ' + error.message, 'error');
        }
    },
    
    stopLoginCamera: function() {
        if (this.loginStream) {
            this.loginStream.getTracks().forEach(track => track.stop());
            const video = document.getElementById('loginVideo');
            video.srcObject = null;
            document.getElementById('recognizeFace').disabled = true;
            document.getElementById('startLogin').disabled = false;
        }
    },
    
    recognizeFace: async function() {
        const video = document.getElementById('loginVideo');
        const messageElement = document.getElementById('loginMessage');
        
        try {
            // Detectăm fața
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();
            
            if (detections.length === 0) {
                showMessage('loginMessage', 'Nu s-a detectat nicio față.', 'error');
                return;
            }
            
            // Verificăm dacă fața este recunoscută
            const faceMatcher = new faceapi.FaceMatcher(Object.keys(faceDescriptors).map(
                userName => new faceapi.LabeledFaceDescriptors(
                    userName, 
                    [new Float32Array(faceDescriptors[userName])]
                )
            ));
            
            const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
            
            if (bestMatch.label !== 'unknown' && bestMatch.distance < 0.5) {
                showMessage('loginMessage', `Autentificare reușită! Bun venit, ${bestMatch.label}!`, 'success');
                // Aici poți redirecționa utilizatorul sau face altceva după autentificare
            } else {
                showMessage('loginMessage', 'Fața nu este recunoscută. Încercați din nou sau înregistrați-vă.', 'error');
            }
        } catch (error) {
            console.error('Eroare la recunoașterea feței:', error);
            showMessage('loginMessage', 'Eroare la recunoașterea feței: ' + error.message, 'error');
        }
    }
};

// Oprim camera când se închide tab-ul
document.getElementById('loginTab').addEventListener('click', function() {
    if (!this.classList.contains('active')) {
        auth.stopLoginCamera();
    }
});