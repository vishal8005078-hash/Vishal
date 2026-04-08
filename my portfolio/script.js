/* =========================================
   VISHAL'S EDIT ZONE
   ========================================= */

const DEFAULT_CONFIG = {
  name: "Vishal Das",
  tagline: "Solo Game Dev / Technical Artist",
  intro:
    "I build tactile digital worlds, blending technical art, game-feel thinking, and premium front-end craft into interfaces that feel calm, soft, and precise.",
  quote:
    "Mastering the tools is the science; finding the Forgotten Paths is the art. From Godot scripts to pixel-perfect HTML, everything is crafted with care.",
  studioLabel: "Vyro Studios",
  studioDescription:
    "A creative label for stylized assets, engine-side experiments, and quietly polished interactions shaped with an indie developer's eye.",
  brandSubtitle: "Minimalist-Cute Portfolio",
  contactHeading: "Let's build something with texture and intent.",
  contactNote:
    "Available for indie collaboration, technical art, polished web builds, and playable portfolio experiments.",
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
    "Godot Engine",
    "Technical Art",
    "Gameplay UI",
    "HTML / CSS",
    "JavaScript",
    "Blender",
    "Shader Thinking",
    "Web Builds"
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
      blurb:
        "A misty exploration prototype with soft lighting, lore fragments, and tactile traversal loops."
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
      blurb:
        "A modular voxel toolkit focused on readable forms, rapid iteration, and engine-friendly stylization."
    }
  ]
};

function loadPortfolioConfig() {
  const configNode = document.getElementById("portfolio-config");

  if (!configNode) {
    return DEFAULT_CONFIG;
  }

  try {
    const parsed = JSON.parse(configNode.textContent);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      style: {
        ...DEFAULT_CONFIG.style,
        ...(parsed.style || {})
      },
      socialLinks: {
        ...DEFAULT_CONFIG.socialLinks,
        ...(parsed.socialLinks || {})
      },
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_CONFIG.skills,
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : DEFAULT_CONFIG.projects
    };
  } catch (error) {
    console.error("Invalid OWNER ZONE config in index.html", error);
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

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function springTo(current, target, velocityRef, stiffness = 0.12, damping = 0.8) {
  velocityRef.value += (target - current) * stiffness;
  velocityRef.value *= damping;
  return current + velocityRef.value;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getFilteredProjects() {
  if (state.filter === "All") {
    return PORTFOLIO_CONFIG.projects;
  }

  if (state.filter === PORTFOLIO_CONFIG.studioLabel) {
    return PORTFOLIO_CONFIG.projects.filter((project) => project.isStudioWork);
  }

  return PORTFOLIO_CONFIG.projects.filter((project) => project.category === state.filter);
}

function getProjectView(project) {
  return state.projectViews[project.title] || "final";
}

function getActionMeta(project) {
  if (project.isPlayable) {
    const lowerType = project.type.toLowerCase();

    if (lowerType.includes("browser") || lowerType.includes("web")) {
      return { label: "Play in Browser", href: project.playLink };
    }

    if (lowerType.includes("download") || lowerType.includes("windows")) {
      return { label: "Download Game", href: project.playLink };
    }

    return { label: "Play Game", href: project.playLink };
  }

  return {
    label: "View Details",
    href: project.playLink && project.playLink !== "#" ? project.playLink : project.screenshot
  };
}

function renderHero() {
  sections.heroName.textContent = PORTFOLIO_CONFIG.name;
  sections.heroTagline.textContent = PORTFOLIO_CONFIG.tagline;
  sections.heroDescription.textContent = PORTFOLIO_CONFIG.intro;
  sections.brandName.textContent = PORTFOLIO_CONFIG.name;
  sections.brandSubtitle.textContent = PORTFOLIO_CONFIG.brandSubtitle;

  const summaryItems = [
    ["Studio", PORTFOLIO_CONFIG.studioLabel],
    ["Projects", String(PORTFOLIO_CONFIG.projects.length)],
    ["Playable", String(PORTFOLIO_CONFIG.projects.filter((project) => project.isPlayable).length)],
    ["Skills", String(PORTFOLIO_CONFIG.skills.length)]
  ];

  sections.configPreview.innerHTML = summaryItems
    .map(
      ([label, value]) => `
        <div class="config-item">
          <strong>${label}</strong>
          <span>${value}</span>
        </div>
      `
    )
    .join("");
}

function renderQuote() {
  sections.fillQuote.textContent = PORTFOLIO_CONFIG.quote;
  sections.fillQuote.dataset.text = PORTFOLIO_CONFIG.quote;
}

function renderFilters() {
  const categories = ["All", PORTFOLIO_CONFIG.studioLabel];

  sections.filterRow.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-chip ${state.filter === category ? "active" : ""}" data-filter="${category}">
          ${category}
        </button>
      `
    )
    .join("");

  sections.filterRow.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      state.currentIndex = 0;
      renderFilters();
      renderProjects();
      syncSlider(true);
    });
  });
}

function projectCardTemplate(project) {
  const action = getActionMeta(project);
  const view = getProjectView(project);
  const cardId = slugify(project.title);

  return `
    <article class="project-card glass reveal-card">
      <div class="project-visual" data-parallax-card>
        <img
          class="project-image ${view === "final" ? "is-active" : ""}"
          src="${project.screenshot}"
          alt="${project.title} final screenshot"
          data-parallax-image
          data-view="final"
        >
        <img
          class="project-image ${view === "process" ? "is-active" : ""}"
          src="${project.processScreenshot || project.screenshot}"
          alt="${project.title} process view"
          data-parallax-image
          data-view="process"
        >
        <div class="tool-badge-row">
          ${project.tools.map((tool) => `<span class="tool-badge">${tool}</span>`).join("")}
        </div>
        <div class="project-overlay">
          <button
            class="action-button"
            type="button"
            data-open-link="${action.href}"
            aria-label="${action.label} for ${project.title}"
          >
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
        <div class="view-toggle" data-project="${cardId}">
          <button class="view-chip ${view === "final" ? "active" : ""}" type="button" data-view-toggle="final">
            Final Render
          </button>
          <button class="view-chip ${view === "process" ? "active" : ""}" type="button" data-view-toggle="process">
            Process Peek
          </button>
        </div>
        <span class="project-type">${project.type}</span>
      </div>
    </article>
  `;
}

function renderProjects() {
  const projects = getFilteredProjects();
  sections.sliderTrack.innerHTML = projects.map(projectCardTemplate).join("");
  bindRevealCards();
  bindParallaxCards();
  bindViewToggles();
  bindActionButtons();
}

function renderStudio() {
  sections.studioLabel.textContent = PORTFOLIO_CONFIG.studioLabel;
  sections.studioDescription.textContent = PORTFOLIO_CONFIG.studioDescription;
}

function renderSkills() {
  sections.skillsCloud.innerHTML = PORTFOLIO_CONFIG.skills
    .map((skill, index) => {
      const delay = (index % 4) * 0.8;
      return `<span class="skill-chip" style="animation-delay:${delay}s">${skill}</span>`;
    })
    .join("");
}

function renderContact() {
  sections.contactHeading.textContent = PORTFOLIO_CONFIG.contactHeading;
  sections.contactNote.textContent = PORTFOLIO_CONFIG.contactNote;
  sections.saySomethingLink.textContent = PORTFOLIO_CONFIG.saySomethingLabel;
  sections.saySomethingLink.href = PORTFOLIO_CONFIG.saySomethingLink;
}

function getSocialIcon(key) {
  const icons = {
    instagram: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
        <circle cx="12" cy="12" r="4.2"></circle>
        <circle cx="17.4" cy="6.8" r="1.1" class="social-dot"></circle>
      </svg>
    `,
    whatsapp: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.2a7.7 7.7 0 0 0-6.62 11.63L4.3 19.7l3.96-1.04A7.7 7.7 0 1 0 12 4.2Z"></path>
        <path d="M9.45 8.85c-.2-.45-.42-.46-.62-.47h-.53c-.18 0-.46.07-.7.33-.24.27-.92.9-.92 2.2 0 1.3.95 2.56 1.08 2.74.13.18 1.84 2.95 4.55 4.01 2.25.88 2.71.7 3.2.66.49-.05 1.58-.64 1.8-1.26.22-.62.22-1.15.15-1.26-.07-.11-.26-.18-.55-.33-.29-.14-1.71-.84-1.97-.94-.26-.09-.46-.14-.65.15-.2.29-.75.94-.92 1.13-.17.2-.35.22-.64.08-.29-.14-1.23-.45-2.33-1.45-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.12-.58.13-.13.29-.35.44-.53.15-.18.2-.31.29-.51.09-.2.04-.38-.02-.53-.07-.14-.6-1.44-.85-2.01Z"></path>
      </svg>
    `,
    facebook: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.4 20v-6.76h2.27l.34-2.64H13.4V8.92c0-.76.21-1.28 1.31-1.28h1.4V5.28c-.24-.03-1.06-.1-2.01-.1-1.99 0-3.36 1.21-3.36 3.45v1.97H8.5v2.64h2.24V20h2.66Z"></path>
      </svg>
    `
  };

  return icons[key] || "";
}

function renderSocials() {
  sections.socialRow.innerHTML = socialMeta
    .map(({ key, label }, index) => {
      const href = PORTFOLIO_CONFIG.socialLinks[key];
      return `
        <a
          class="social-button"
          href="${href}"
          target="_blank"
          rel="noreferrer"
          data-magnetic
          style="animation-delay:${index * 0.35}s"
          aria-label="${key}"
        >
          <span class="social-icon">${getSocialIcon(key)}</span>
          <span class="social-label">${label}</span>
        </a>
      `;
    })
    .join("");

  bindMagnetic();
}

function bindRevealCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".reveal-card").forEach((card) => observer.observe(card));
}

function bindParallaxCards() {
  document.querySelectorAll("[data-parallax-card]").forEach((card) => {
    const images = [...card.querySelectorAll("[data-parallax-image]")];
    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const localX = (event.clientX - rect.left) / rect.width - 0.5;
      const localY = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.x = localX * 14;
      pointer.y = localY * 14;
    });

    card.addEventListener("pointerleave", () => {
      pointer.x = 0;
      pointer.y = 0;
    });

    const animate = () => {
      current.x = lerp(current.x, pointer.x, 0.08);
      current.y = lerp(current.y, pointer.y, 0.08);
      images.forEach((image) => {
        image.style.transform = `scale(1.08) translate3d(${current.x}px, ${current.y}px, 0)`;
      });
      requestAnimationFrame(animate);
    };

    animate();
  });
}

function bindMagnetic() {
  document.querySelectorAll("[data-magnetic]").forEach((element) => {
    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const velocityX = { value: 0 };
    const velocityY = { value: 0 };

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      pointer.x = x * 0.22;
      pointer.y = y * 0.22;
    });

    element.addEventListener("pointerleave", () => {
      pointer.x = 0;
      pointer.y = 0;
    });

    const animate = () => {
      current.x = springTo(current.x, pointer.x, velocityX);
      current.y = springTo(current.y, pointer.y, velocityY);
      element.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      requestAnimationFrame(animate);
    };

    animate();
  });
}

function bindViewToggles() {
  document.querySelectorAll("[data-project]").forEach((toggleGroup) => {
    toggleGroup.querySelectorAll("[data-view-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const projectId = toggleGroup.dataset.project;
        const project = PORTFOLIO_CONFIG.projects.find((item) => slugify(item.title) === projectId);

        if (!project) {
          return;
        }

        state.projectViews[project.title] = button.dataset.viewToggle;
        const card = toggleGroup.closest(".project-card");
        if (!card) {
          return;
        }

        card.querySelectorAll("[data-view-toggle]").forEach((chip) => {
          chip.classList.toggle("active", chip === button);
        });

        card.querySelectorAll(".project-image").forEach((image) => {
          image.classList.toggle("is-active", image.dataset.view === button.dataset.viewToggle);
        });
      });
    });
  });
}

function pressAndOpen(button, href) {
  if (!href) {
    return;
  }

  button.classList.add("is-pressed");

  window.setTimeout(() => {
    button.classList.remove("is-pressed");
    window.open(href, "_blank", "noopener,noreferrer");
  }, 120);
}

function bindActionButtons() {
  document.querySelectorAll("[data-open-link]").forEach((button) => {
    button.addEventListener("click", () => {
      pressAndOpen(button, button.dataset.openLink);
    });
  });
}

function bindTextReveals() {
  const revealTargets = document.querySelectorAll(
    ".hero-copy > *, .section-head > div > *, .quote-shell > *, .studio-card > *, .contact-card > *"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("text-reveal");
    element.style.transitionDelay = `${(index % 4) * 90}ms`;
    observer.observe(element);
  });
}

function getCardWidth() {
  const firstCard = sections.sliderTrack.querySelector(".project-card");
  if (!firstCard) {
    return 0;
  }

  const style = window.getComputedStyle(sections.sliderTrack);
  const gap = Number.parseFloat(style.columnGap || style.gap || "0");
  return firstCard.getBoundingClientRect().width + gap;
}

function syncSlider(immediate = false) {
  const cardWidth = getCardWidth();
  const projects = getFilteredProjects();

  if (!projects.length) {
    state.sliderTargetX = 0;
    return;
  }

  state.currentIndex = Math.max(0, Math.min(state.currentIndex, projects.length - 1));
  state.sliderTargetX = -(state.currentIndex * cardWidth);

  if (immediate) {
    state.sliderX = state.sliderTargetX;
    sections.sliderTrack.style.transform = `translate3d(${state.sliderX}px, 0, 0)`;
  }
}

function animateSlider() {
  state.sliderX = lerp(state.sliderX, state.sliderTargetX, 0.1);
  sections.sliderTrack.style.transform = `translate3d(${state.sliderX}px, 0, 0)`;
  requestAnimationFrame(animateSlider);
}

function bindSliderControls() {
  sections.prevSlide.addEventListener("click", () => {
    state.currentIndex -= 1;
    syncSlider();
  });

  sections.nextSlide.addEventListener("click", () => {
    state.currentIndex += 1;
    syncSlider();
  });

  window.addEventListener("resize", () => syncSlider(true));

  window.setInterval(() => {
    const projects = getFilteredProjects();
    if (projects.length <= 1) {
      return;
    }

    state.currentIndex = (state.currentIndex + 1) % projects.length;
    syncSlider();
  }, 4800);
}

function updateQuoteFill() {
  const quoteRect = sections.fillQuote.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const raw = 1 - (quoteRect.top + quoteRect.height * 0.35) / (viewportHeight + quoteRect.height * 0.5);
  const progress = Math.max(0, Math.min(1, raw));
  sections.fillQuote.style.setProperty("--fill", `${progress * 100}%`);
}

function initSmoothScroll() {
  if (!window.Lenis) {
    return;
  }

  const lenis = new window.Lenis({
    duration: 1.15,
    smoothWheel: true,
    lerp: 0.08
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function preloadProjectImages() {
  const imageSources = PORTFOLIO_CONFIG.projects.flatMap((project) => [
    project.screenshot,
    project.processScreenshot || project.screenshot
  ]);

  const uniqueSources = [...new Set(imageSources)];
  const minDelay = new Promise((resolve) => window.setTimeout(resolve, 2800));

  const imagePromises = uniqueSources.map(
    (src) =>
      new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = src;
      })
  );

  return Promise.all([Promise.allSettled(imagePromises), minDelay]);
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

  window.addEventListener("scroll", updateQuoteFill, { passive: true });

  preloadProjectImages().finally(finishLoading);
}

init();
