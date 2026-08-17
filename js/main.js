(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Preloader: burger build + layered wipe reveal ---------- */
  var preloader = document.getElementById("preloader");
  var barFill = document.getElementById("preloadBarFill");
  var statusEl = document.getElementById("preloadStatus");
  var revealOrange = document.getElementById("revealOrange");
  var revealMaroon = document.getElementById("revealMaroon");
  var burger = preloader.querySelector(".preload-burger");
  var body = document.body;

  var steps = [
    { at: 0, el: burger.querySelector(".bun-bottom"), text: "Prendiendo la plancha…" },
    { at: 18, el: burger.querySelector(".patty"), text: "Smasheando la carne…" },
    { at: 36, el: burger.querySelector(".cheese"), text: "Derritiendo el cheddar…" },
    { at: 54, el: burger.querySelector(".tomato"), text: "Cortando tomate fresco…" },
    { at: 72, el: burger.querySelector(".lettuce"), text: "Sumando lechuga crocante…" },
    { at: 88, el: burger.querySelector(".bun-top"), text: "Cerrando con pan brioche…" }
  ];
  var nextStep = 0;
  var finished = false;

  function applySteps(progress) {
    while (nextStep < steps.length && progress >= steps[nextStep].at) {
      steps[nextStep].el.classList.add("is-visible");
      statusEl.textContent = steps[nextStep].text;
      nextStep++;
    }
  }

  function finishPreload() {
    if (finished) return;
    finished = true;

    applySteps(100);
    barFill.style.width = "100%";
    statusEl.textContent = "¡Lista!";

    setTimeout(function () {
      preloader.classList.add("leave");
    }, 400);
    setTimeout(function () {
      revealOrange.classList.add("leave");
    }, 750);
    setTimeout(function () {
      revealMaroon.classList.add("leave");
    }, 1100);
    setTimeout(function () {
      preloader.remove();
      revealOrange.remove();
      revealMaroon.remove();
      body.classList.remove("no-scroll");
    }, 1950);
  }

  var progress = 0;
  var loadTick = setInterval(function () {
    progress += Math.random() * 14 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadTick);
      setTimeout(finishPreload, 250);
    }
    barFill.style.width = progress + "%";
    applySteps(progress);
  }, 160);

  // Safety net: never trap the user behind the preloader.
  setTimeout(finishPreload, 5000);

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
