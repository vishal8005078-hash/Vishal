/* =========================================
   VISHAL'S EDIT ZONE
   ========================================= */

const DEFAULT_CONFIG = {
  name: "Vishal Das",
  tagline: "Solo Game Dev / Technical Artist",
  intro: "I build tactile digital worlds, blending technical art, game-feel thinking, and premium front-end craft into interfaces that feel calm, soft, and precise.",
  quote: "Mastering the tools is the science; finding the Forgotten Paths is the art. From Godot scripts to pixel-perfect HTML, everything is crafted with care.",
  studioLabel: "Vyro Studios",
  studioDescription: "A creative label for stylized assets, engine-side experiments, and quietly polished interactions shaped with an indie developer's eye.",
  brandSubtitle: "Minimalist-Cute Portfolio",
  contactHeading: "Let's build something with texture and intent.",
  contactNote: "Available for indie collaboration, technical art, polished web builds, and playable portfolio experiments.",
  saySomethingLabel: "Say Something",
  saySomethingLink: "https://forms.gle/your-form-link-here",
  style: {
    primaryColor: "#A8B5A2",
    secondaryColor: "#CDA7AE",
    borderRadius: "32px"
  },
  socialLinks: {
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/",
    facebook: "https://facebook.com/"
  },
  skills: [
    "Godot Engine","Technical Art","Gameplay UI","HTML / CSS",
    "JavaScript","Blender","Shader Thinking","Web Builds"
  ],
  projects: [
    {
      title: "Forgotten Paths",
      category: "Personal / RPG",
      status: "Worldbuilding",
      screenshot: "./assets/paths_hero.svg",
      processScreenshot: "./assets/paths_process.svg",
      playLink: "https://vishaldas.itch.io/forgotten-paths",
      isPlayable: true,
      type: "Web Build",
      isStudioWork: false,
      tools: ["GO", "BL", "JS"],
      blurb: "A misty exploration prototype with soft lighting, lore fragments, and tactile traversal loops."
    },
    {
      title: "Voxel Kit v1",
      category: "Vyro Studios",
      status: "Asset System",
      screenshot: "./assets/voxel_thumb.svg",
      processScreenshot: "./assets/voxel_process.svg",
      playLink: "./assets/voxel_thumb.svg",
      isPlayable: false,
      type: "Asset Pack",
      isStudioWork: true,
      tools: ["GO", "BL", "GD"],
      blurb: "A modular voxel toolkit focused on readable forms, rapid iteration, and engine-friendly stylization."
    }
  ]
};

function loadPortfolioConfig() {
  const configNode = document.getElementById("portfolio-config");
  if (!configNode) return DEFAULT_CONFIG;
  try {
    const parsed = JSON.parse(configNode.textContent);
    return {
      ...DEFAULT_CONFIG, ...parsed,
      style: { ...DEFAULT_CONFIG.style, ...(parsed.style || {}) },
      socialLinks: { ...DEFAULT_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_CONFIG.skills,
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : DEFAULT_CONFIG.projects
    };
  } catch (e) {
    console.error("Invalid OWNER ZONE config", e);
    return DEFAULT_CONFIG;
  }
}

const PORTFOLIO_CONFIG = loadPortfolioConfig();

const root = document.documentElement;
root.style.setProperty("--accent", PORTFOLIO_CONFIG.style.primaryColor);
root.style.setProperty("--accent-alt", PORTFOLIO_CONFIG.style.secondaryColor);
root.style.setProperty("--radius-lg", PORTFOLIO_CONFIG.style.borderRadius);

document.body.classList.add("is-loading");

const state = {
  filter: "All",
  currentIndex: 0,
  sliderX: 0,
  sliderTargetX: 0,
  projectViews: {}
};

const sections = {
  loader: document.getElementById("page-loader"),
  heroName: document.getElementById("hero-name"),
  heroTagline: document.getElementById("hero-tagline"),
  heroDescription: document.getElementById("hero-description"),
  brandName: document.getElementById("brand-name"),
  brandSubtitle: document.getElementById("brand-subtitle"),
  configPreview: document.getElementById("config-preview"),
  fillQuote: document.getElementById("fill-quote"),
  filterRow: document.getElementById("filter-row"),
  sliderTrack: document.getElementById("slider-track"),
  studioLabel: document.getElementById("studio-label"),
  studioDescription: document.getElementById("studio-description"),
  skillsCloud: document.getElementById("skills-cloud"),
  contactHeading: document.getElementById("contact-heading"),
  contactNote: document.getElementById("contact-note"),
  socialRow: document.getElementById("social-row"),
  saySomethingLink: document.getElementById("say-something-link"),
  prevSlide: document.getElementById("prev-slide"),
  nextSlide: document.getElementById("next-slide")
};

const socialMeta = [
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "facebook", label: "Facebook" }
];

function lerp(a, b, t) { return a + (b - a) * t; }

function springTo(cur, tar, vel, s = 0.12, d = 0.8) {
  vel.v += (tar - cur) * s;
  vel.v *= d;
  return cur + vel.v;
}

function slugify(v) { return v.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

function getFilteredProjects() {
  if (state.filter === "All") return PORTFOLIO_CONFIG.projects;
  if (state.filter === PORTFOLIO_CONFIG.studioLabel)
    return PORTFOLIO_CONFIG.projects.filter(p => p.isStudioWork);
  return PORTFOLIO_CONFIG.projects.filter(p => p.category === state.filter);
}

function getProjectView(p) { return state.projectViews[p.title] || "final"; }

function getActionMeta(p) {
  if (p.isPlayable) {
    const t = p.type.toLowerCase();
    if (t.includes("browser") || t.includes("web")) return { label: "Play in Browser", href: p.playLink };
    if (t.includes("download") || t.includes("windows")) return { label: "Download Game", href: p.playLink };
    return { label: "Play Game", href: p.playLink };
  }
  return { label: "View Details", href: p.playLink && p.playLink !== "#" ? p.playLink : p.screenshot };
}

function renderHero() {
  sections.heroName.textContent = PORTFOLIO_CONFIG.name;
  sections.heroTagline.textContent = PORTFOLIO_CONFIG.tagline;
  sections.heroDescription.textContent = PORTFOLIO_CONFIG.intro;
  sections.brandName.textContent = PORTFOLIO_CONFIG.name;
  sections.brandSubtitle.textContent = PORTFOLIO_CONFIG.brandSubtitle;

  const items = [
    ["Studio", PORTFOLIO_CONFIG.studioLabel],
    ["Projects", String(PORTFOLIO_CONFIG.projects.length)],
    ["Playable", String(PORTFOLIO_CONFIG.projects.filter(p => p.isPlayable).length)],
    ["Skills", String(PORTFOLIO_CONFIG.skills.length)]
  ];

  sections.configPreview.innerHTML = items.map(([label, value]) => `
    <div class="config-item">
      <strong>${label}</strong><span>${value}</span>
    </div>`).join("");
}

function renderQuote() {
  sections.fillQuote.textContent = PORTFOLIO_CONFIG.quote;
  sections.fillQuote.dataset.text = PORTFOLIO_CONFIG.quote;
}

function renderFilters() {
  const cats = ["All", PORTFOLIO_CONFIG.studioLabel];
  sections.filterRow.innerHTML = cats.map(c => `
    <button class="filter-chip ${state.filter === c ? "active" : ""}" data-filter="${c}">${c}</button>`).join("");
  sections.filterRow.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.filter;
      state.currentIndex = 0;
      renderFilters(); renderProjects(); syncSlider(true);
    });
  });
}

function projectCardTemplate(project) {
  const action = getActionMeta(project);
  const view = getProjectView(project);
  const id = slugify(project.title);

  return `
    <article class="project-card glass reveal-card" data-tilt>
      <div class="project-visual" data-parallax-card>
        <img class="project-image ${view === "final" ? "is-active" : ""}"
          src="${project.screenshot}" alt="${project.title} screenshot"
          data-parallax-image data-view="final">
        <img class="project-image ${view === "process" ? "is-active" : ""}"
          src="${project.processScreenshot || project.screenshot}" alt="${project.title} process"
          data-parallax-image data-view="process">
        <div class="tool-badge-row">
          ${project.tools.map(t => `<span class="tool-badge">${t}</span>`).join("")}
        </div>
        <div class="project-overlay">
          <button class="action-button" type="button"
            data-open-link="${action.href}" aria-label="${action.label} for ${project.title}">
            <span class="play-icon" aria-hidden="true"></span>
            <span>${action.label}</span>
          </button>
        </div>
      </div>
      <div class="project-meta">
        <div>
          <p class="meta-label">${project.category}</p>
          <h3>${project.title}</h3>
        </div>
        <span class="status-pill">${project.status}</span>
      </div>
      <p>${project.blurb}</p>
      <div class="project-footer">
        <div class="view-toggle" data-project="${id}">
          <button class="view-chip ${view === "final" ? "active" : ""}" type="button" data-view-toggle="final">Final Render</button>
          <button class="view-chip ${view === "process" ? "active" : ""}" type="button" data-view-toggle="process">Process Peek</button>
        </div>
        <span class="project-type">${project.type}</span>
      </div>
    </article>`;
}

function renderProjects() {
  const projects = getFilteredProjects();
  sections.sliderTrack.innerHTML = projects.map(projectCardTemplate).join("");
  bindRevealCards();
  bindParallaxCards();
  bindViewToggles();
  bindActionButtons();
  bindTiltCards();
}

function renderStudio() {
  sections.studioLabel.textContent = PORTFOLIO_CONFIG.studioLabel;
  sections.studioDescription.textContent = PORTFOLIO_CONFIG.studioDescription;
}

function renderSkills() {
  sections.skillsCloud.innerHTML = PORTFOLIO_CONFIG.skills.map((s, i) =>
    `<span class="skill-chip" style="animation-delay:${(i % 4) * 0.8}s">${s}</span>`
  ).join("");
}

function renderContact() {
  sections.contactHeading.textContent = PORTFOLIO_CONFIG.contactHeading;
  sections.contactNote.textContent = PORTFOLIO_CONFIG.contactNote;
  sections.saySomethingLink.textContent = PORTFOLIO_CONFIG.saySomethingLabel;
  sections.saySomethingLink.href = PORTFOLIO_CONFIG.saySomethingLink;
}

function getSocialIcon(key) {
  const icons = {
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="4.2"></circle><circle cx="17.4" cy="6.8" r="1.1" class="social-dot"></circle></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2a7.7 7.7 0 0 0-6.62 11.63L4.3 19.7l3.96-1.04A7.7 7.7 0 1 0 12 4.2Z"></path><path d="M9.45 8.85c-.2-.45-.42-.46-.62-.47h-.53c-.18 0-.46.07-.7.33-.24.27-.92.9-.92 2.2 0 1.3.95 2.56 1.08 2.74.13.18 1.84 2.95 4.55 4.01 2.25.88 2.71.7 3.2.66.49-.05 1.58-.64 1.8-1.26.22-.62.22-1.15.15-1.26-.07-.11-.26-.18-.55-.33-.29-.14-1.71-.84-1.97-.94-.26-.09-.46-.14-.65.15-.2.29-.75.94-.92 1.13-.17.2-.35.22-.64.08-.29-.14-1.23-.45-2.33-1.45-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.12-.58.13-.13.29-.35.44-.53.15-.18.2-.31.29-.51.09-.2.04-.38-.02-.53-.07-.14-.6-1.44-.85-2.01Z"></path></svg>`,
    facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 20v-6.76h2.27l.34-2.64H13.4V8.92c0-.76.21-1.28 1.31-1.28h1.4V5.28c-.24-.03-1.06-.1-2.01-.1-1.99 0-3.36 1.21-3.36 3.45v1.97H8.5v2.64h2.24V20h2.66Z"></path></svg>`
  };
  return icons[key] || "";
}

function renderSocials() {
  sections.socialRow.innerHTML = socialMeta.map(({ key, label }, i) => {
    const href = PORTFOLIO_CONFIG.socialLinks[key];
    return `<a class="social-button" href="${href}" target="_blank" rel="noreferrer"
      data-magnetic style="animation-delay:${i * 0.35}s" aria-label="${key}">
      <span class="social-icon">${getSocialIcon(key)}</span>
      <span class="social-label">${label}</span>
    </a>`;
  }).join("");
  bindMagnetic();
}

function bindRevealCards() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal-card").forEach(c => obs.observe(c));
}

function bindParallaxCards() {
  document.querySelectorAll("[data-parallax-card]").forEach(card => {
    const imgs = [...card.querySelectorAll("[data-parallax-image]")];
    const ptr = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      ptr.y = ((e.clientY - r.top) / r.height - 0.5) * 14;
    });
    card.addEventListener("pointerleave", () => { ptr.x = 0; ptr.y = 0; });
    const tick = () => {
      cur.x = lerp(cur.x, ptr.x, 0.08);
      cur.y = lerp(cur.y, ptr.y, 0.08);
      imgs.forEach(img => img.style.transform = `scale(1.08) translate3d(${cur.x}px,${cur.y}px,0)`);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function bindTiltCards() {
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.015)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale(1)";
    });
  });
}

function bindMagnetic() {
  document.querySelectorAll("[data-magnetic]").forEach(el => {
    const ptr = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const vx = { v: 0 }, vy = { v: 0 };
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      ptr.x = (e.clientX - r.left - r.width / 2) * 0.22;
      ptr.y = (e.clientY - r.top - r.height / 2) * 0.22;
    });
    el.addEventListener("pointerleave", () => { ptr.x = 0; ptr.y = 0; });
    const tick = () => {
      cur.x = springTo(cur.x, ptr.x, vx);
      cur.y = springTo(cur.y, ptr.y, vy);
      el.style.transform = `translate3d(${cur.x}px,${cur.y}px,0)`;
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function bindViewToggles() {
  document.querySelectorAll("[data-project]").forEach(group => {
    group.querySelectorAll("[data-view-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const proj = PORTFOLIO_CONFIG.projects.find(p => slugify(p.title) === group.dataset.project);
        if (!proj) return;
        state.projectViews[proj.title] = btn.dataset.viewToggle;
        const card = group.closest(".project-card");
        if (!card) return;
        card.querySelectorAll("[data-view-toggle]").forEach(c => c.classList.toggle("active", c === btn));
        card.querySelectorAll(".project-image").forEach(img => img.classList.toggle("is-active", img.dataset.view === btn.dataset.viewToggle));
      });
    });
  });
}

function pressAndOpen(btn, href) {
  if (!href) return;
  btn.classList.add("is-pressed");
  window.setTimeout(() => {
    btn.classList.remove("is-pressed");
    window.open(href, "_blank", "noopener,noreferrer");
  }, 120);
}

function bindActionButtons() {
  document.querySelectorAll("[data-open-link]").forEach(btn => {
    btn.addEventListener("click", () => pressAndOpen(btn, btn.dataset.openLink));
  });
}

function bindTextReveals() {
  const targets = document.querySelectorAll(
    ".hero-copy > *, .section-head > div > *, .quote-shell > *, .studio-card > *, .contact-card > *"
  );
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
  }, { threshold: 0.18 });
  targets.forEach((el, i) => {
    el.classList.add("text-reveal");
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
    obs.observe(el);
  });
}

function getCardWidth() {
  const first = sections.sliderTrack.querySelector(".project-card");
  if (!first) return 0;
  const gap = parseFloat(window.getComputedStyle(sections.sliderTrack).columnGap || "0");
  return first.getBoundingClientRect().width + gap;
}

function syncSlider(immediate = false) {
  const w = getCardWidth();
  const projects = getFilteredProjects();
  if (!projects.length) { state.sliderTargetX = 0; return; }
  state.currentIndex = Math.max(0, Math.min(state.currentIndex, projects.length - 1));
  state.sliderTargetX = -(state.currentIndex * w);
  if (immediate) {
    state.sliderX = state.sliderTargetX;
    sections.sliderTrack.style.transform = `translate3d(${state.sliderX}px,0,0)`;
  }
}

function animateSlider() {
  state.sliderX = lerp(state.sliderX, state.sliderTargetX, 0.1);
  sections.sliderTrack.style.transform = `translate3d(${state.sliderX}px,0,0)`;
  requestAnimationFrame(animateSlider);
}

function bindSliderControls() {
  sections.prevSlide.addEventListener("click", () => { state.currentIndex -= 1; syncSlider(); });
  sections.nextSlide.addEventListener("click", () => { state.currentIndex += 1; syncSlider(); });
  window.addEventListener("resize", () => syncSlider(true));
  window.setInterval(() => {
    const projects = getFilteredProjects();
    if (projects.length <= 1) return;
    state.currentIndex = (state.currentIndex + 1) % projects.length;
    syncSlider();
  }, 4800);
}

function updateQuoteFill() {
  const r = sections.fillQuote.getBoundingClientRect();
  const vh = window.innerHeight;
  const raw = 1 - (r.top + r.height * 0.35) / (vh + r.height * 0.5);
  sections.fillQuote.style.setProperty("--fill", `${Math.max(0, Math.min(1, raw)) * 100}%`);
}

function initSmoothScroll() {
  if (!window.Lenis) return;
  const lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.08 });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

/* cursor trail */
function initCursorTrail() {
  const dots = [];
  const count = 8;
  for (let i = 0; i < count; i++) {
    const d = document.createElement("span");
    d.className = "cursor-dot";
    d.style.opacity = String(1 - i / count);
    d.style.width = d.style.height = `${10 - i}px`;
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }
  let mx = 0, my = 0;
  window.addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
  function tick() {
    dots.forEach((dot, i) => {
      const prev = i === 0 ? { x: mx, y: my } : dots[i - 1];
      dot.x = lerp(dot.x, prev.x, 0.35);
      dot.y = lerp(dot.y, prev.y, 0.35);
      dot.el.style.transform = `translate3d(${dot.x - 5}px, ${dot.y - 5}px, 0)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
}

/* loader text cycling */
function initLoaderText() {
  const el = document.querySelector(".loader-text");
  if (!el) return;
  const msgs = ["Crafting worlds…", "Loading assets…", "Polishing pixels…", "Almost there…"];
  let i = 0;
  const iv = setInterval(() => {
    i = (i + 1) % msgs.length;
    el.style.opacity = "0";
    setTimeout(() => { el.textContent = msgs[i]; el.style.opacity = "1"; }, 200);
  }, 800);
  return iv;
}

function preloadProjectImages() {
  const srcs = [...new Set(PORTFOLIO_CONFIG.projects.flatMap(p => [p.screenshot, p.processScreenshot || p.screenshot]))];
  /* ↓ reduced from 2800 → 1500 ms */
  const minDelay = new Promise(r => window.setTimeout(r, 1500));
  const imgs = srcs.map(src => new Promise(r => {
    const img = new Image();
    img.onload = img.onerror = r;
    img.src = src;
  }));
  return Promise.all([Promise.allSettled(imgs), minDelay]);
}

function finishLoading() {
  sections.loader.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
}

function init() {
  renderHero();
  renderQuote();
  renderFilters();
  renderProjects();
  renderStudio();
  renderSkills();
  renderContact();
  renderSocials();
  bindTextReveals();
  bindSliderControls();
  syncSlider(true);
  animateSlider();
  updateQuoteFill();
  initSmoothScroll();
  initCursorTrail();
  const loaderInterval = initLoaderText();
  window.addEventListener("scroll", updateQuoteFill, { passive: true });
  preloadProjectImages().finally(() => {
    clearInterval(loaderInterval);
    finishLoading();
  });
}

init();
