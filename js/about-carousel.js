(function () {
  "use strict";

  var track = document.getElementById("aboutCarouselTrack");
  var dotsEl = document.getElementById("aboutDots");
  var prevBtn = document.getElementById("aboutPrev");
  var nextBtn = document.getElementById("aboutNext");
  var carousel = document.getElementById("aboutCarousel");
  if (!track) return;

  var AUTOPLAY_MS = 4500;
  var slides = [];
  var current = 0;
  var timer = null;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  }

  function render(items) {
    slides = items.filter(function (it) { return it && it.image; });

    if (!slides.length) {
      track.innerHTML = '<div class="about-carousel__slide"><img src="images/denver.jpg" alt="Hamburguesa Smash Burger" /></div>';
      dotsEl.innerHTML = "";
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }

    track.innerHTML = slides.map(function (s) {
      return (
        '<div class="about-carousel__slide">' +
          '<img src="' + escapeHtml(s.image) + '" alt="' + escapeHtml(s.alt || "Smash Burger") + '" loading="lazy" />' +
        '</div>'
      );
    }).join("");

    dotsEl.innerHTML = slides.map(function (_, i) {
      return '<button type="button" class="about-carousel__dot' + (i === 0 ? " is-active" : "") + '" data-i="' + i + '" aria-label="Ir a la foto ' + (i + 1) + '"></button>';
    }).join("");

    var hideNav = slides.length < 2;
    prevBtn.hidden = hideNav;
    nextBtn.hidden = hideNav;

    goTo(0);
    if (slides.length > 1) startAutoplay();
  }

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    dotsEl.querySelectorAll(".about-carousel__dot").forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  prevBtn.addEventListener("click", function () { prev(); startAutoplay(); });
  nextBtn.addEventListener("click", function () { next(); startAutoplay(); });
  dotsEl.addEventListener("click", function (e) {
    var dot = e.target.closest(".about-carousel__dot");
    if (!dot) return;
    goTo(parseInt(dot.dataset.i, 10));
    startAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", function () { if (slides.length > 1) startAutoplay(); });

  fetch("about.json", { cache: "no-store" })
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function () { render([]); });
})();
