document.addEventListener("DOMContentLoaded", () => {
  const musicBtn = document.querySelector(".music-btn");
  const musicIcon = document.querySelector(".music-icon");
  const bgMusic = document.getElementById("background-music");

  let musicPlaying = false;
  if (bgMusic && musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (musicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = "🔇";
      } else {
        bgMusic.play();
        musicIcon.textContent = "🔊";
      }
      musicPlaying = !musicPlaying;
    });
  }

  // Carrusel
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) slide.classList.add("active");
    });
  }

  const prev = document.querySelector(".prev-slide");
  const next = document.querySelector(".next-slide");

  if (prev && next && slides.length > 0) {
    prev.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
    next.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
    showSlide(currentSlide);
  }

  // GPS + Manual
  const locations = {
    castillo: { lat: 40.520512, lng: -6.063541 },
    plaza: { lat: 40.520621, lng: -6.063455 },
    iglesia: { lat: 40.521379, lng: -6.063810 },
    fuente: { lat: 40.522185, lng: -6.064564 },
    ermita: { lat: 40.522793, lng: -6.066424 },
    puente: { lat: 40.522552, lng: -6.065858 },
    bodega: { lat: 40.521659, lng: -6.064401 }
  };

  const stop = window.location.pathname.split("/").pop().replace(".html", "");
  const statusEl = document.getElementById("location-status");
  const arrow = document.getElementById("direction-arrow");

  window.checkLocation = () => {
    if (navigator.geolocation && locations[stop]) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const target = locations[stop];
          const distance = getDistance(userLat, userLng, target.lat, target.lng);

          if (distance <= 25) {
            statusEl.textContent = "✅ Ubicación verificada. Puedes continuar.";
            unlockContent();
          } else {
            statusEl.textContent = `📍 Estás a ${Math.round(distance)}m del punto. Acércate más.`;
            updateArrow(userLat, userLng, target.lat, target.lng);
          }
        },
        (err) => {
          statusEl.textContent = "⚠️ Error al obtener ubicación: " + err.message;
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      statusEl.textContent = "⚠️ Geolocalización no disponible o punto no definido.";
    }
  };

  window.checkLocationManual = () => {
    const input = document.getElementById("location-input");
    if (input && stop) {
      const valor = input.value.trim().toLowerCase();
      if (valor.includes(stop)) {
        statusEl.textContent = "✅ Verificado manualmente.";
        unlockContent();
      } else {
        statusEl.textContent = "❌ Ubicación incorrecta. Intenta de nuevo.";
      }
    }
  };

  function unlockContent() {
    const game = document.getElementById("game-content");
    const check = document.getElementById("location-check");
    if (game) game.style.display = "block";
    if (check) check.style.display = "none";
    localStorage.setItem(`${stop}-completed`, "true");
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function updateArrow(userLat, userLng, targetLat, targetLng) {
    if (!arrow) return;
    const angleRad = Math.atan2(targetLng - userLng, targetLat - userLat);
    const angleDeg = angleRad * (180 / Math.PI);
    arrow.style.transform = `rotate(${angleDeg}deg)`;
    arrow.style.display = "block";
  }

  // Giroscopio
  if (window.DeviceOrientationEvent && arrow) {
    window.addEventListener("deviceorientation", function (event) {
      const heading = event.alpha;
      if (typeof heading === "number") {
        arrow.style.transform = `rotate(${heading}deg)`;
      }
    });
  }

  // Progreso general en explorar.html
  const stops = ["castillo", "plaza", "iglesia", "fuente", "ermita", "puente", "bodega"];
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  if (progressFill && progressText) {
    const completed = stops.filter((s) => localStorage.getItem(`${s}-completed`) === "true").length;
    const percent = (completed / stops.length) * 100;
    progressFill.style.width = percent + "%";
    progressText.textContent = `Paradas completadas: ${completed}/${stops.length}`;
  }

});
