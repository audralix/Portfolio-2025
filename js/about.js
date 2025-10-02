document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("aboutScene");
  if (!stage) return;

  const A = (f) => `./assets/aboutAssets/${f}`;

  const BG_ROOM = A("240902_room-07.png");
  const BG_NATURE = A("240901_nature.png");
  const BASE = A("Asset 1.png");

  const CAT_FACE = A("Asset 12.png");
  const CAT_RIGHT = A("Asset 17.png");
  const COFFEE = A("Asset 22.png");
  const CAM_HAND = A("Asset 14.png");
  const HEADPH = A("Asset 15.png");

  // base layers
  const bgLayer = new Image();
  bgLayer.className = "scene-layer bg is-on";
  bgLayer.src = BG_ROOM;
  stage.appendChild(bgLayer);

  const baseLayer = new Image();
  baseLayer.className = "scene-layer base is-on";
  baseLayer.src = encodeURI(BASE);
  stage.appendChild(baseLayer);

  // overlays wrapper
  const wrap = document.createElement("div");
  wrap.style.position = "absolute";
  wrap.style.inset = "0";
  wrap.style.pointerEvents = "none";
  stage.appendChild(wrap);

  const mk = (src, cls, alt = "") => {
    const im = new Image();
    im.src = src;
    im.alt = alt;
    im.className = `overlay ${cls}`;
    wrap.appendChild(im);
    return im;
  };

  const layers = {
    catFace: mk(CAT_FACE, "cat-face", "Cat face"),
    catRight: mk(CAT_RIGHT, "cat-right", "Cat right"),
    coffee: mk(COFFEE, "coffee", "Coffee mug"),
    asset14: mk(CAM_HAND, "asset14", "Camera"),
    asset15: mk(HEADPH, "asset15", "Headphones"),
  };

  const show = (el) => el.classList.add("is-on");
  const hide = (el) => el.classList.remove("is-on");
  const hideAllOverlays = () => Object.values(layers).forEach(hide);

  function swapBackground(toSrc) {
    if (bgLayer.src.endsWith(toSrc)) return;
    const next = new Image();
    next.className = "scene-layer bg";
    next.src = toSrc;
    stage.insertBefore(next, baseLayer);
    requestAnimationFrame(() => next.classList.add("is-on"));
    bgLayer.classList.remove("is-on");
    setTimeout(() => {
      bgLayer.src = toSrc;
      bgLayer.classList.add("is-on");
      next.remove();
    }, 300);
  }

  // --- Step definitions (sequence) ---
  const steps = [
    {
      text: "Cat Companion",
      action: () => {
        swapBackground(BG_ROOM);
        hideAllOverlays();
        show(layers.catFace);
        show(layers.catRight);
      },
    },
    {
      text: "Coffee Ritual",
      action: () => {
        swapBackground(BG_ROOM);
        hideAllOverlays();
        show(layers.coffee);
      },
    },
    {
      text: "Nature Escape",
      action: () => {
        swapBackground(BG_NATURE);
        hideAllOverlays();
      },
    },
    {
      text: "Capturing Moments",
      action: () => {
        swapBackground(BG_NATURE);
        hideAllOverlays();
        show(layers.asset14);
      },
    },
    {
      text: "Tuning In",
      action: () => {
        swapBackground(BG_NATURE);
        hideAllOverlays();
        show(layers.asset15);
      },
    },
  ];

  let current = 0;
  const traitText = document.getElementById("traitText");
  const dotsWrap = document.getElementById("traitDots");

  // create dots
  steps.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "trait-dot";
    dot.addEventListener("click", () => {
      current = i;
      renderStep();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function renderStep() {
    const step = steps[current];
    traitText.textContent = step.text;
    step.action();

    // update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  document.getElementById("prevBtn").addEventListener("click", () => {
    current = (current - 1 + steps.length) % steps.length;
    renderStep();
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    current = (current + 1) % steps.length;
    renderStep();
  });

  // initial
  renderStep();
});
