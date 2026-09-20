document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     LOADER
  ========================================= */

  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loader-fill");
  const loaderCounter = document.getElementById("loader-counter");

  let progress = 0;

  const loaderInterval = setInterval(() => {

    const increment =
      Math.floor(Math.random() * 12) + 5;

    progress += increment;

    if (progress >= 100) {
      progress = 100;

      clearInterval(loaderInterval);

      setTimeout(() => {
        loader.classList.add("hidden");
      }, 350);
    }

    loaderFill.style.width = `${progress}%`;
    loaderCounter.textContent = `${progress}%`;

  }, 65);


  /* =========================================
     HERO CARD TILT
  ========================================= */

  const card = document.getElementById("tilt-card");

  if (card && window.matchMedia("(pointer: fine)").matches) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    document.addEventListener("mousemove", (event) => {

      const x =
        (event.clientX / window.innerWidth) - 0.5;

      const y =
        (event.clientY / window.innerHeight) - 0.5;

      targetX = y * -5;
      targetY = x * 5;

    });


    const animateTilt = () => {

      currentX +=
        (targetX - currentX) * 0.08;

      currentY +=
        (targetY - currentY) * 0.08;

      card.style.transform =
        `perspective(1100px)
         rotateX(${currentX}deg)
         rotateY(${currentY}deg)`;

      requestAnimationFrame(animateTilt);
    };

    animateTilt();


    card.addEventListener("mouseleave", () => {

      targetX = 0;
      targetY = 0;

    });

  }


  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const reveals =
    document.querySelectorAll(".reveal");


  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  reveals.forEach((section) => {
    revealObserver.observe(section);
  });


  /* =========================================
     ACTIVE NAVIGATION
  ========================================= */

  const navLinks =
    document.querySelectorAll(".nav-btn");

  const sections =
    document.querySelectorAll(
      "#projects, #about, #skills, #contact"
    );


  const updateActiveNavigation = () => {

    const scrollPosition =
      window.scrollY + window.innerHeight * 0.35;


    let currentSection = "";


    sections.forEach((section) => {

      const sectionTop =
        section.offsetTop;

      const sectionBottom =
        sectionTop + section.offsetHeight;


      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionBottom
      ) {
        currentSection = section.id;
      }

    });


    navLinks.forEach((link) => {

      link.classList.remove("active");

      if (
        link.dataset.section === currentSection
      ) {
        link.classList.add("active");
      }

    });

  };


  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );


  updateActiveNavigation();


  /* =========================================
     NAVBAR HIDE/SHOW ON MOBILE
  ========================================= */

  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {

      const currentScrollY =
        window.scrollY;

      const navbar =
        document.querySelector(".navbar");

      if (!navbar) return;


      if (
        window.innerWidth <= 650 &&
        currentScrollY > lastScrollY &&
        currentScrollY > 100
      ) {

        navbar.style.transform =
          "translateY(-100%)";

      } else {

        navbar.style.transform =
          "translateY(0)";

      }


      lastScrollY = currentScrollY;

    },
    { passive: true }
  );


  /* =========================================
     SMOOTH ANCHOR OFFSET
  ========================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(targetId);

        if (!target) return;


        event.preventDefault();


        const navbarHeight =
          document.querySelector(".navbar")
            ?.offsetHeight || 0;


        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight -
          20;


        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

      });

    });

});
