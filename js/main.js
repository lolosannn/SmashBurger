(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

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

  /* ---------- Scroll reveal ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  function observeReveals(root) {
    (root || document).querySelectorAll(".reveal").forEach(function (el) {
      if (el.dataset.revealObserved) return;
      el.dataset.revealObserved = "1";
      revealIO.observe(el);
    });
  }

  observeReveals(document);

  /* ---------- Menu: rendered from menu.json ---------- */
  var menuGrid = document.getElementById("menuGrid");
  var fullMenuGrid = document.getElementById("fullMenuGrid");
  var menuItems = [];

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  }

  function renderMenu(container, items, stagger) {
    if (!items.length) {
      container.innerHTML = '<p class="menu-loading">Todavía no hay platos cargados.</p>';
      return;
    }
    container.innerHTML = items.map(function (item, i) {
      var delay = stagger ? ' style="transition-delay:' + (i * 0.07) + 's"' : "";
      return (
        '<article class="menu-card reveal reveal--up"' + delay + '>' +
          '<div class="menu-card__photo">' +
            '<img src="' + escapeHtml(item.image) + '" alt="Burger ' + escapeHtml(item.name) + '" loading="lazy" />' +
            '<span class="price-tag">' + escapeHtml(item.price) + '</span>' +
          '</div>' +
          '<h3>' + escapeHtml(item.name) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
          '<div class="menu-card__footer">' +
            '<span class="tag-pill">' + escapeHtml(item.tag) + '</span>' +
          '</div>' +
        '</article>'
      );
    }).join("");
    observeReveals(container);
  }

  fetch("menu.json", { cache: "no-store" })
    .then(function (res) { return res.json(); })
    .then(function (items) {
      menuItems = items;
      renderMenu(menuGrid, items, true);
      if (fullMenu && fullMenu.classList.contains("is-open")) {
        renderMenu(fullMenuGrid, items, true);
        fullMenuGrid.dataset.rendered = String(items.length);
      }
    })
    .catch(function () {
      menuGrid.innerHTML = '<p class="menu-loading">No pudimos cargar el menú. Volvé a intentar más tarde.</p>';
    });

  /* ---------- Carta completa: vista a pantalla completa ---------- */
  var fullMenu = document.getElementById("fullMenu");
  var openFullMenuBtn = document.getElementById("openFullMenu");
  var fullMenuBackBtn = document.getElementById("fullMenuBack");

  var fullMenuHistoryPushed = false;

  function openFullMenu(e) {
    if (e) e.preventDefault();
    if (fullMenuGrid && (!fullMenuGrid.dataset.rendered || fullMenuGrid.dataset.rendered !== String(menuItems.length))) {
      renderMenu(fullMenuGrid, menuItems, true);
      fullMenuGrid.dataset.rendered = String(menuItems.length);
    }
    fullMenu.classList.add("is-open");
    fullMenu.setAttribute("aria-hidden", "false");
    body.classList.add("no-scroll");
    fullMenu.scrollTop = 0;
    if (location.hash !== "#carta") {
      history.pushState({ fullMenu: true }, "", "#carta");
      fullMenuHistoryPushed = true;
    }
  }

  function closeFullMenu(scrollToMenu) {
    if (!fullMenu.classList.contains("is-open")) return;
    fullMenu.classList.remove("is-open");
    fullMenu.setAttribute("aria-hidden", "true");
    body.classList.remove("no-scroll");
    if (location.hash === "#carta") {
      if (fullMenuHistoryPushed) {
        history.back();
      } else {
        history.replaceState(null, "", location.pathname + location.search);
      }
    }
    fullMenuHistoryPushed = false;
    if (scrollToMenu) {
      var target = document.getElementById("menu");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (openFullMenuBtn) openFullMenuBtn.addEventListener("click", openFullMenu);

  if (fullMenuBackBtn) {
    fullMenuBackBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeFullMenu(true);
    });
  }

  window.addEventListener("popstate", function () {
    if (location.hash !== "#carta") closeFullMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeFullMenu(false);
  });

  if (location.hash === "#carta") openFullMenu();
})();
