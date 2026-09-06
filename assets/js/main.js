/* ═══════════════════════════════════════════════════════════════
   main.js — boot sequence · command nav · clock · toast · skills
   · work-grid render.  No dependencies, no build step.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── boot sequence ─────────────────────────────────────────── */
  const BOOT = [
    [{ t: "> ", c: "cmd" }, { t: "./senthil --init", c: "gr" }],
    [{ t: "[ok] ", c: "ok" }, { t: "profile", c: "" }, { t: "  Senthilnathan S", c: "val" }],
    [{ t: "[ok] ", c: "ok" }, { t: "role", c: "" }, { t: "  Web Developer @ Cognizant", c: "val" }],
    [{ t: "[ok] ", c: "ok" }, { t: "base", c: "" }, { t: "  Chennai, India", c: "val" }],
    [{ t: "[ok] ", c: "ok" }, { t: "theme", c: "" }, { t: "  terminal × glass", c: "val" }]
  ];

  function runBoot() {
    const overlay = document.getElementById("boot");
    const log = document.getElementById("bootLog");
    if (!overlay) return;

    if (reduced) {
      renderAllLines(log);
      setTimeout(() => overlay.classList.add("is-done"), 150);
      return;
    }

    let line = 0, col = 0;
    const lineEl = document.createElement("div");
    const cls = { gr: "gr", ok: "ok", val: "val" };

    function typeLine() {
      if (line >= BOOT.length) {
        setTimeout(() => overlay.classList.add("is-done"), 380);
        return;
      }
      if (col === 0) {
        lineEl.textContent = "";
        log.appendChild(lineEl);
      }
      const cur = BOOT[line][col];
      const node = document.createElement("span");
      node.textContent = cur.t;
      if (cls[cur.c]) node.className = cls[cur.c];
      lineEl.appendChild(node);
      col++;
      if (col < BOOT[line].length) {
        setTimeout(typeLine, 34);
      } else {
        col = 0; line++;
        setTimeout(typeLine, 140);
      }
    }
    typeLine();
  }

  function renderAllLines(log) {
    let html = "";
    BOOT.forEach(spans => {
      html += spans.map(s =>
        s.c === "gr" ? `<span class="gr">${s.t}</span>`
        : s.c === "ok" ? `<span class="ok">${s.t}</span>`
        : s.c === "val" ? `<span class="val">${s.t}</span>`
        : s.t
      ).join("");
    });
    log.innerHTML = html;
  }

  runBoot();

  /* ── clock ─────────────────────────────────────────────────── */
  const clock = document.getElementById("clock");
  function tick() {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    if (clock) clock.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ── command nav ───────────────────────────────────────────── */
  const GHOST = { about: "01", resume: "02", work: "03", contact: "04" };
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  panels.forEach(p => { p.classList.add("is-focusable"); p.setAttribute("tabindex", "-1"); p.setAttribute("data-ghost", GHOST[p.dataset.page] || ""); });

  let toastTimer = null;
  function toast(name) {
    const el = document.getElementById("toast");
    if (!el || reduced) return;
    const ms = 8 + Math.floor(Math.random() * 34);
    el.innerHTML = `$ npm run ${name} &nbsp;<b>↗ done</b>&nbsp; <span class="ts">in ${ms}ms</span>`;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), 1600);
  }

  function activate(page) {
    buttons.forEach(b => b.classList.toggle("is-active", b.dataset.tab === page));
    panels.forEach(p => p.classList.toggle("is-active", p.dataset.page === page));

    const active = panels.find(p => p.dataset.page === page);
    if (active) active.focus({ preventScroll: true });

    if (page === "resume") { skillsGo(); }
    toast(page);
  }

  buttons.forEach(b =>
    b.addEventListener("click", () => activate(b.dataset.tab))
  );

  /* ── skills fill ───────────────────────────────────────────── */
  const sk = document.getElementById("skills");
  function skillsGo() {
    if (!sk || reduced) return;
    sk.classList.remove("is-go");
    requestAnimationFrame(() => requestAnimationFrame(() => sk.classList.add("is-go")));
  }

  /* ── work grid from data.js ────────────────────────────────── */
  const grid = document.getElementById("workGrid");
  function renderWork() {
    if (!grid) return;
    const frag = document.createDocumentFragment();

    PROJECTS.forEach((proj, i) => {
      const rel = "~/projects/" + slug(proj.name) + ".html";
      const card = el("article", "workcard");
      card.innerHTML = `
        <div class="workcard__head"><i></i><i></i><i></i><span class="workcard__path"></span></div>
        <div class="workcard__body">
          <div class="workcard__top">
            <span class="workcard__tag"></span>
            <span class="workcard__year"></span>
          </div>
          <h3 class="workcard__name"></h3>
          <p class="workcard__desc"></p>
          <pre class="workcard__code"></pre>
        </div>
        <div class="workcard__foot"></div>`;

      card.querySelector(".workcard__path").textContent = rel;
      card.querySelector(".workcard__tag").textContent = proj.tag;
      card.querySelector(".workcard__year").textContent = proj.year;
      card.querySelector(".workcard__name").textContent = proj.name;
      card.querySelector(".workcard__desc").textContent = proj.desc;
      card.querySelector(".workcard__code").textContent = proj.code;

      const foot = card.querySelector(".workcard__foot");
      foot.appendChild(linkCell("↗ code", proj.href));
      foot.appendChild(linkCell("live demo", proj.demo));

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "project"; }

  function linkCell(label, href) {
    const a = document.createElement(href ? "a" : "span");
    a.className = "workcard__link" + (href ? "" : " is-tbd");
    a.textContent = href ? label : `${label} — tbd`;
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function el(tag, cls) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  renderWork();
})();