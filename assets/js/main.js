/* betterVIDEOS - Interaktionen (ohne Abhängigkeiten) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobiles Menü ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) {
      menu.removeAttribute("inert");
      var first = menu.querySelector("a");
      if (first) first.focus();
    } else {
      menu.setAttribute("inert", "");
    }
  }
  if (toggle && menu) {
    menu.setAttribute("inert", "");
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty("--i", i); });
  });
  var reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, [data-stagger]");
  if (!prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Mobile Kontaktleiste nach dem Hero ---------- */
  var bar = document.querySelector(".contact-bar");
  var heroEl = document.querySelector("[data-hero]");
  if (bar && heroEl && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }).observe(heroEl);
  } else if (bar) {
    bar.classList.add("is-visible");
  }

  /* ---------- Video-Slider: läuft langsam durch, pausiert bei Interaktion ---------- */
  document.querySelectorAll("[data-slider]").forEach(function (root) {
    var track = root.querySelector(".vslider__track");
    var section = root.closest("section") || document;
    var prev = section.querySelector("[data-prev]");
    var next = section.querySelector("[data-next]");
    if (!track) return;
    function step() {
      var card = track.querySelector(".vcard");
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return card.getBoundingClientRect().width + gap;
    }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function update() {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = atEnd();
    }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step() }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step() }); });
    track.addEventListener("scroll", update, { passive: true });
    update();
    if (prefersReduced || !root.hasAttribute("data-autoplay")) return;
    var paused = false, visible = false;
    ["mouseenter", "focusin", "touchstart", "pointerdown"].forEach(function (ev) {
      root.addEventListener(ev, function () { paused = true; }, { passive: true });
    });
    root.addEventListener("mouseleave", function () { paused = false; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(root);
    }
    setInterval(function () {
      if (paused || !visible || document.hidden) return;
      if (atEnd()) track.scrollTo({ left: 0 }); else track.scrollBy({ left: step() });
    }, 4500);
  });

  /* ---------- Kontaktformular: Inline-Fehler, dann E-Mail-Programm ---------- */
  var form = document.querySelector("[data-mail-form]");
  if (form) {
    function check(field) {
      var wrap = field.closest(".field");
      var err = document.getElementById(field.id + "-err");
      var ok = field.checkValidity();
      if (wrap) wrap.classList.toggle("field--invalid", !ok);
      if (err) err.hidden = ok;
      field.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }
    var required = form.querySelectorAll("[required]");
    required.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value) check(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      required.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) { firstBad.focus(); return; }
      var d = new FormData(form);
      var body = [
        "Name: " + (d.get("name") || ""),
        "Unternehmen: " + (d.get("firma") || ""),
        "E-Mail: " + (d.get("email") || ""),
        "Telefon: " + (d.get("telefon") || ""),
        "Ziel: " + (d.get("ziel") || ""),
        "",
        d.get("nachricht") || ""
      ].join("\n");
      var subject = "Projektanfrage: " + (d.get("ziel") || "Video");
      window.location.href = "mailto:mail@bettervideos.de?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Referenzen-Filter ---------- */
  var filterWrap = document.querySelector("[data-filters]");
  if (filterWrap) {
    var projects = document.querySelectorAll("[data-cat]");
    var empty = document.querySelector("[data-empty]");
    var status = document.querySelector("[data-filter-status]");
    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var cat = btn.getAttribute("data-filter");
      filterWrap.querySelectorAll("[data-filter]").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      var shown = 0;
      projects.forEach(function (p) {
        var match = cat === "alle" || p.getAttribute("data-cat") === cat;
        p.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      if (status) status.textContent = shown + (shown === 1 ? " Projekt" : " Projekte") + " angezeigt";
    });
  }

  /* ---------- Vorschaubilder von Vimeo (oEmbed, erst wenn die Karte in Sicht kommt) ---------- */
  var thumbs = document.querySelectorAll("img[data-thumb]");
  if (thumbs.length && window.fetch) {
    var cacheGet = function (id) { try { return sessionStorage.getItem("bv-thumb-" + id); } catch (e) { return null; } };
    var cacheSet = function (id, url) { try { sessionStorage.setItem("bv-thumb-" + id, url); } catch (e) { /* egal */ } };
    var show = function (img, url) {
      img.onload = function () { img.hidden = false; img.classList.add("is-loaded"); };
      img.onerror = function () { img.remove(); };
      img.src = url;
    };
    var loadThumb = function (img) {
      var id = img.getAttribute("data-thumb");
      var hit = cacheGet(id);
      if (hit) { show(img, hit); return; }
      fetch("https://vimeo.com/api/oembed.json?width=960&url=" + encodeURIComponent("https://vimeo.com/" + id))
        .then(function (r) { if (!r.ok) throw r; return r.json(); })
        .then(function (d) {
          if (!d.thumbnail_url) return;
          var url = d.thumbnail_url.replace(/_\d+x\d+/, "_960x540");
          cacheSet(id, url);
          show(img, url);
        })
        .catch(function () { img.remove(); });
    };
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { tio.unobserve(en.target); loadThumb(en.target); }
        });
      }, { rootMargin: "400px 0px" });
      thumbs.forEach(function (img) { tio.observe(img); });
    } else {
      thumbs.forEach(loadThumb);
    }
  }

  /* ---------- Video-Dialog (2-Klick-Lösung für Vimeo) ---------- */
  var dialog = document.getElementById("video-dialog");
  if (dialog && typeof dialog.showModal === "function") {
    var frame = dialog.querySelector(".video-dialog__frame");
    var titleEl = dialog.querySelector(".video-dialog__title");
    var fallback = dialog.querySelector("[data-video-fallback]");
    var consentKey = "bv-vimeo-ok";
    var current = null;
    var lastTrigger = null;

    function hasConsent() {
      try { return sessionStorage.getItem(consentKey) === "1"; } catch (e) { return false; }
    }
    function giveConsent() {
      try { sessionStorage.setItem(consentKey, "1"); } catch (e) { /* privat-Modus */ }
    }
    function loadPlayer(id) {
      frame.innerHTML = "";
      var iframe = document.createElement("iframe");
      iframe.src = "https://player.vimeo.com/video/" + encodeURIComponent(id) + "?dnt=1&autoplay=1&title=0&byline=0&portrait=0";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.title = titleEl.textContent;
      frame.appendChild(iframe);
    }
    function showConsent(id) {
      frame.innerHTML = "";
      var box = document.createElement("div");
      box.className = "video-dialog__consent";
      var p = document.createElement("p");
      p.textContent = "Beim Abspielen wird das Video von Vimeo geladen. Dabei werden Daten an Vimeo übertragen. Mehr dazu in der Datenschutzerklärung.";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--primary";
      btn.textContent = "Video abspielen";
      btn.addEventListener("click", function () { giveConsent(); loadPlayer(id); });
      box.append(p, btn);
      frame.appendChild(box);
      btn.focus();
    }
    function openVideo(id, title, trigger) {
      current = id;
      lastTrigger = trigger || null;
      titleEl.textContent = title || "Video";
      if (fallback) fallback.href = "https://vimeo.com/" + id;
      dialog.showModal();
      if (hasConsent()) loadPlayer(id); else showConsent(id);
    }
    function closeVideo() {
      frame.innerHTML = "";
      current = null;
      if (dialog.open) dialog.close();
    }
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-vimeo]");
      if (!t) return;
      e.preventDefault();
      openVideo(t.getAttribute("data-vimeo"), t.getAttribute("data-title"), t);
    });
    dialog.querySelector(".video-dialog__close").addEventListener("click", closeVideo);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeVideo(); });
    dialog.addEventListener("close", function () {
      frame.innerHTML = "";
      if (lastTrigger) lastTrigger.focus();
    });
  }
})();
