// ===== NAV JS (tiny, accessible) =====
(function () {
  const header = document.querySelector("[data-nav]");
  const btn = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");

  // Toggle mobile menu
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("open", !open);
    btn.setAttribute("aria-label", !open ? "Close menu" : "Open menu");
  });

  // Close menu when clicking a link (mobile)
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      btn.setAttribute("aria-label", "Open menu");
    });
  });

  // Add shadow on scroll
  const onScroll = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 4);
  onScroll();
  window.addEventListener("scroll", onScroll);
})();

(() => {
  const rootStyles = getComputedStyle(document.documentElement);
  const HEADER_OFFSET =
    parseInt(rootStyles.getPropertyValue("--header-h")) || 64;

  const nav = document.querySelector(".process-nav");

  // 1) Collect ALL links (parents + subitems)
  const links = Array.from(nav.querySelectorAll('.process-list a[href^="#"]'));
  const items = links.map((a) => a.closest("li"));
  const secs = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // 2) Smooth scroll with offset
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute("href"));
      const y =
        t.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 8;
      window.scrollTo({ top: y, behavior: "smooth" });

      // If user clicked a sub-item, ensure its parent group is open
      const parent = a.closest(".has-children");
      if (parent) openGroup(parent, true);
    });
  });

  // 3) Toggle buttons for groups
  nav.querySelectorAll(".has-children .toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const li = e.currentTarget.closest(".has-children");
      const isOpen = li.getAttribute("aria-open") === "true";
      openGroup(li, !isOpen);
    });
  });

  function openGroup(li, open = true) {
    const sub = li.querySelector(".sublist");
    if (!sub) return;
    sub.hidden = !open;
    li.setAttribute("aria-open", String(open));
    const toggle = li.querySelector(".toggle");
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  }

  // 4) Active state + auto-open when a sub-section is active
  function setActive(idx) {
    items.forEach((li, i) => {
      const a = links[i];
      const active = i === idx;
      li.classList.toggle("is-active", active);
      a.classList.toggle("is-active", active);
    });

    // If an active link is inside a group, open that group
    const activeLink = links[idx];
    const parentGroup = activeLink && activeLink.closest(".has-children");
    if (parentGroup) openGroup(parentGroup, true);
  }

  // 5) Theme detection (unchanged)
  function setThemeUnderNav() {
    const r = nav.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const stack = document.elementsFromPoint(cx, cy);
    const behind = stack.find((el) => !el.closest(".process-nav"));
    const themedAncestor =
      behind && (behind.closest("[data-theme]") || behind.closest("section"));
    const theme = themedAncestor && themedAncestor.getAttribute("data-theme");
    nav.classList.toggle("is-inverse", theme === "dark");
  }

  // 6) Scroll spy (unchanged logic, now works for all links incl. subitems)
  function onScroll() {
    const y = window.scrollY + HEADER_OFFSET + 12;
    let idx = 0;
    secs.forEach((s, i) => {
      if (s.offsetTop <= y) idx = i;
    });
    const doc = document.documentElement;
    if (innerHeight + window.scrollY >= doc.scrollHeight - 2)
      idx = secs.length - 1;

    setActive(idx);
    setThemeUnderNav();
  }

  let ticking = false;
  addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  addEventListener("resize", onScroll);
  document.addEventListener("DOMContentLoaded", onScroll);
  onScroll();
})();
