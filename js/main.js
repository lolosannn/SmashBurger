(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  var bar = document.getElementById("preloaderBar");
  var counter = document.getElementById("preloaderCounter");
  var body = document.body;

  function finishPreload() {
    if (preloader.classList.contains("is-hidden")) return;
    bar.style.width = "100%";
    counter.textContent = "100";
    preloader.classList.add("is-hidden");
    body.classList.remove("no-scroll");
    setTimeout(function () {
      preloader.remove();
    }, 950);
  }

  var progress = 0;
  var loadTick = setInterval(function () {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadTick);
      setTimeout(finishPreload, 260);
    }
    bar.style.width = progress + "%";
    counter.textContent = Math.floor(progress);
  }, 140);

  // Safety net: never trap the user behind the preloader.
  setTimeout(finishPreload, 4000);

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
})();
