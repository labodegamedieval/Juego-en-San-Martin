document.addEventListener('DOMContentLoaded', function () {
  let musicPlaying = true;
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

  // Verificación de ubicación GPS y Manual
  function checkLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          document.getElementById('location-status').textContent = `📍 Ubicación detectada: Lat ${userLat}, Lng ${userLng}`;
          unlockContent();
        },
        (error) => {
          document.getElementById('location-status').textContent = `⚠️ Error: ${error.message}`;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      document.getElementById('location-status').textContent = '⚠️ Tu navegador no soporta geolocalización.';
    }
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
  }
});
