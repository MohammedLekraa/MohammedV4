document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     LOADER
  ========================================================== */

  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loader-fill");
  const loaderCounter = document.getElementById("loader-counter");
  const loaderStatus = document.getElementById("loader-status");

  let progress = 0;

  const loaderMessages = [
    "BOOT_SEQUENCE",
    "LOADING_INTERFACE",
    "INITIALIZING_SYSTEMS",
    "CHECKING_MODULES",
    "READY"
  ];

  const loaderInterval = setInterval(() => {

    const increment = Math.floor(Math.random() * 10) + 5;

    progress += increment;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);

      loaderStatus.textContent = "READY";

      setTimeout(() => {
        loader.classList.add("hidden");
      }, 350);
    }

    loaderFill.style.width = `${progress}%`;
    loaderCounter.textContent = `${progress}%`;

    const messageIndex = Math.min(
      Math.floor(progress / 20),
      loaderMessages.length - 1
    );

    loaderStatus.textContent = loaderMessages[messageIndex];

  }, 65);


  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section-anchor");

  const updateActiveNavigation = () => {

    const scrollPosition = window.scrollY + 180;

    let currentSection = "home";

    sections.forEach((section) => {

      const sectionTop = section.offsetTop;

      if (scrollPosition >= sectionTop) {
        currentSection = section.id;
      }

    });

    navButtons.forEach((button) => {

      const sectionName = button.dataset.section;

      button.classList.toggle(
        "active",
        sectionName === currentSection
      );

    });

  };

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );

  updateActiveNavigation();


  /* ==========================================================
     MOBILE MENU
  ========================================================== */

  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

  }

  navButtons.forEach((button) => {

    button.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });

  });


  /* ==========================================================
     SCROLL REVEAL
  ========================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          revealObserver.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* ==========================================================
     HERO TILT
  ========================================================== */

  const card = document.getElementById("tilt-card");

  if (card && window.matchMedia("(pointer: fine)").matches) {

    card.addEventListener("mousemove", (event) => {

      const rect = card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width;

      const y =
        (event.clientY - rect.top) /
        rect.height;

      const rotateY = (x - 0.5) * 8;
      const rotateX = (y - 0.5) * -8;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-4px)
      `;

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        translateY(0)
      `;

    });

  }


  /* ==========================================================
     PROJECT CARD POINTER EFFECT
  ========================================================== */

  const projectCards =
    document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

      if (window.innerWidth <= 800) {
        return;
      }

      const rect = card.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

    });

  });


  /* ==========================================================
     SMOOTH ANCHOR OFFSET
  ========================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", (event) => {

      const targetId =
        anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const navbarHeight = 76;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });

});
