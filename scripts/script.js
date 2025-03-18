document.addEventListener('DOMContentLoaded', function () {
  let musicPlaying = true;
  const bgMusic = document.getElementById("background-music");
  const musicIcon = document.getElementById("music-icon");

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play();
      musicIcon.textContent = "🔊";
    } else {
      bgMusic.pause();
      musicIcon.textContent = "🔇";
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
