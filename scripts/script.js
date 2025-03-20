document.addEventListener('DOMContentLoaded', function () {
  const bgMusic = document.getElementById("background-music");

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  }

  document.querySelector(".music-btn").addEventListener("click", toggleMusic);

  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  document.querySelector(".prev-slide").addEventListener("click", () => {
    currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
    showSlide(currentSlide);
  });

  document.querySelector(".next-slide").addEventListener("click", () => {
    currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
    showSlide(currentSlide);
  });

  showSlide(currentSlide);
});

  // 🔹 Verificación de ubicación con distancia y giroscopio 🔹
  const locations = {
    'castillo': { lat: 40.520512, lng: -6.063541 },
    'fuente': { lat: 40.522185, lng: -6.064564 }
  };

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en metros
  }

  function checkLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        const stop = window.location.pathname.split('/').pop().replace('.html', '');
        const targetLocation = locations[stop];

        if (targetLocation) {
          const distance = getDistanceFromLatLonInMeters(userLat, userLng, targetLocation.lat, targetLocation.lng);
          if (distance <= 20) {
            document.getElementById('location-status').textContent = '✅ Ubicación verificada. Puedes continuar.';
            unlockContent();
          } else {
            document.getElementById('location-status').textContent = `📍 Estás a ${Math.round(distance)} metros del punto exacto. Precisión GPS: ${Math.round(accuracy)}m.`;
            updateDirection(userLat, userLng, targetLocation.lat, targetLocation.lng);
          }
        } else {
          document.getElementById('location-status').textContent = '❌ Ubicación no encontrada.';
        }
      },
      (error) => {
        document.getElementById('location-status').textContent = '⚠️ Error: ' + error.message;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    document.getElementById('location-status').textContent = '⚠️ Tu navegador no soporta geolocalización.';
  }
}

  function updateDirection(userLat, userLng, targetLat, targetLng) {
    const arrow = document.getElementById('direction-arrow');
    if (!arrow) return;

    const deltaX = targetLng - userLng;
    const deltaY = targetLat - userLat;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    arrow.style.transform = `rotate(${angle}deg)`;
    arrow.style.display = "block";
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (event) {
      const arrow = document.getElementById('direction-arrow');
      if (arrow) {
        const compassHeading = event.alpha;
        arrow.style.transform = `rotate(${compassHeading}deg)`;
      }
    }, true);
  }

  function checkLocationManual() {
    const input = document.getElementById('location-input').value.trim().toLowerCase();
    const stop = window.location.pathname.split('/').pop().replace('.html', '');
    if (input === stop) {
      document.getElementById('location-status').textContent = '✅ Ubicación confirmada manualmente.';
      unlockContent();
    } else {
      document.getElementById('location-status').textContent = '❌ Ubicación incorrecta. Intenta de nuevo.';
    }
  }

  function unlockContent() {
    document.getElementById('game-content').style.display = 'block';
    document.getElementById('location-check').style.display = 'none';
    playSound('success-sound');
  }

  function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
});
