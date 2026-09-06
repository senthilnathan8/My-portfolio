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
    const bar = document.getElementById("bootBar");
    const BOOT_TYPEMS = 48, BOOT_LINE = 340, BOOT_DONE = 560;
    if (!overlay) return;

    function fillBar() {
      if (!bar) return;
      let total = BOOT_DONE;
      BOOT.forEach(sp => { total += (sp.length - 1) * BOOT_TYPEMS + BOOT_LINE; });
      bar.style.transition = "none";
      bar.style.width = "100%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = `width ${total}ms linear`;
        bar.style.width = "100%";
      }));
    }

    if (reduced) {
      renderAllLines(log);
      if (bar) bar.style.width = "100%";
      setTimeout(() => {
        overlay.classList.add("is-done");
        document.body.classList.add("is-ready");
        document.dispatchEvent(new Event("ready-reveal"));
      }, 150);
      return;
    }

    fillBar();
    let line = 0, col = 0;
    const lineEl = document.createElement("div");
    const cls = { gr: "gr", ok: "ok", val: "val" };

    function typeLine() {
      if (line >= BOOT.length) {
        setTimeout(() => {
          overlay.classList.add("is-done");
          document.body.classList.add("is-ready");
          document.dispatchEvent(new Event("ready-reveal"));
        }, BOOT_DONE);
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
        setTimeout(typeLine, BOOT_TYPEMS);
      } else {
        col = 0; line++;
        setTimeout(typeLine, BOOT_LINE);
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

  /* ── hero: one-shot typed tag on reveal ─────────────────────── */
  const typeEl = document.getElementById("typeLine");
  const TAG = "Angular · .NET · JavaScript · HTML · CSS";
  function startType() {
    if (!typeEl) return;
    if (reduced) { typeEl.textContent = TAG; return; }
    let ci = 0;
    (function typeOnce() {
      ci++;
      typeEl.textContent = TAG.slice(0, ci) || " ";
      if (ci < TAG.length) setTimeout(typeOnce, 52);
    })();
  }
  if (typeEl) document.addEventListener("ready-reveal", startType, { once: true });

  /* ── sysread: live uptime + mem ────────────────────────────── */
  const upEl = document.getElementById("uptime");
  const memEl = document.getElementById("mem");
  let upSecs = 0;
  setInterval(() => {
    upSecs++;
    if (upEl) {
      const s = upSecs % 60, m = Math.floor(upSecs / 60) % 60, h = Math.floor(upSecs / 3600);
      upEl.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    if (memEl) memEl.textContent = (38 + Math.floor(Math.random() * 26)) + "%";
  }, 1000);

  /* ── status footer: cycling commands ────────────────────────── */
  const TERM = [
    "./stack --online",
    "ng serve --watch",
    "dotnet build --release",
    "git push --deploy",
    "npm run ship"
  ];
  const wordsEl = document.querySelector(".ticker__words");
  if (wordsEl && !reduced) {
    let i = 1;
    setInterval(() => { wordsEl.textContent = TERM[i++ % TERM.length]; }, 2600);
  }

  /* ── command nav ───────────────────────────────────────────── */
  const GHOST = { about: "01", resume: "02", work: "03", contact: "04" };
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const panels = Array.from(document.querySelectorAll(".panel"));
  const pill = document.querySelector(".cmdnav__pill");

  panels.forEach(p => { p.classList.add("is-focusable"); p.setAttribute("tabindex", "-1"); p.setAttribute("data-ghost", GHOST[p.dataset.page] || ""); });

  /* Apple — slide the active-tab pill to hug the pressed button,
     springing from the button's live position (interruptible).
     left/top/width/height so a wrapped nav (mobile) stays correct. */
  function movePill() {
    if (!pill || reduced) { if (pill) pill.style.opacity = "0"; return; }
    const active = document.querySelector(".nav-btn.is-active");
    const nav = document.querySelector(".cmdnav");
    if (!active || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const r = active.getBoundingClientRect();
    pill.style.opacity = "1";
    pill.style.width = r.width + "px";
    pill.style.height = r.height + "px";
    pill.style.left = (r.left - navRect.left) + "px";
    pill.style.top = (r.top - navRect.top) + "px";
  }
  movePill();
  window.addEventListener("resize", movePill);

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

  function scan(panel) {
    /* keep the sweep's visual speed constant on every page: a taller
       panel travels farther, so give it a proportionally longer run. */
    const h = Math.round(panel.getBoundingClientRect().height) || 600;
    const dur = Math.min(Math.max(1.0 * (h / 600), 0.8), 2.4);
    panel.style.setProperty("--scan", dur.toFixed(2) + "s");
    panel.classList.remove("is-scan");
    requestAnimationFrame(() => { panel.classList.add("is-scan"); });
  }

  function activate(page) {
    buttons.forEach(b => b.classList.toggle("is-active", b.dataset.tab === page));
    panels.forEach(p => p.classList.toggle("is-active", p.dataset.page === page));

    const active = panels.find(p => p.dataset.page === page);
    if (active) { active.focus({ preventScroll: true }); scan(active); }

    if (page === "resume") { skillsGo(); }
    toast(page);
    movePill();
  }

  buttons.forEach(b =>
    b.addEventListener("click", () => activate(b.dataset.tab))
  );

  /* scan the visible panel once when the page reveals */
  document.addEventListener("ready-reveal", () => {
    const active = document.querySelector(".panel.is-active");
    if (active) scan(active);
    movePill(); /* fonts are in — re-measure the pill */
  });

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
      card.style.setProperty("--i", i);
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

  /* stagger the work cards once, right after the boot overlay lifts */
  document.addEventListener("ready-reveal", () => {
    if (grid) grid.classList.add("is-go");
  }, { once: true });
})();