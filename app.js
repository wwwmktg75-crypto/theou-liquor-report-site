const slides = Array.from(document.querySelectorAll(".slide"));
const tocLinks = Array.from(document.querySelectorAll(".toc__link"));
const counter = document.querySelector("#slide-counter");
const previousButton = document.querySelector('[data-action="previous"]');
const nextButton = document.querySelector('[data-action="next"]');
const accessGateForm = document.querySelector("#access-gate-form");
const accessPasswordInput = document.querySelector("#access-password");
const accessGateError = document.querySelector("#access-gate-error");
const accessStorageKey = "zaou-liquor-report-access";
let activeSlideIndex = 0;

function unlockReport() {
  document.body.classList.remove("is-locked");
}

if (window.sessionStorage.getItem(accessStorageKey) === "granted") {
  unlockReport();
}

accessGateForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (accessPasswordInput?.value === "zaou") {
    window.sessionStorage.setItem(accessStorageKey, "granted");
    unlockReport();
    return;
  }

  accessGateError.hidden = false;
  accessPasswordInput?.focus();
});

slides.forEach((slide, index) => {
  const slideNumber = slide.querySelector(".slide__number");
  if (slideNumber) {
    slideNumber.textContent = String(index + 1);
  }
});

function updateActiveSlide(index) {
  activeSlideIndex = index;
  const activeSlide = slides[index];

  tocLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeSlide?.id}`);
  });

  if (counter) {
    counter.textContent = `${index + 1} / ${slides.length}`;
  }

  if (previousButton) {
    previousButton.disabled = index === 0;
  }

  if (nextButton) {
    nextButton.disabled = index === slides.length - 1;
  }
}

function goToSlide(index) {
  const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
  const slide = slides[safeIndex];
  if (!slide) return;
  slide.scrollIntoView({ behavior: "smooth", block: "start" });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const index = slides.indexOf(visible.target);
    if (index >= 0) {
      updateActiveSlide(index);
    }
  },
  {
    threshold: [0.4, 0.6, 0.8],
    rootMargin: "-18% 0px -18% 0px",
  }
);

slides.forEach((slide) => observer.observe(slide));
updateActiveSlide(0);

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "previous":
      goToSlide(activeSlideIndex - 1);
      break;
    case "next":
      goToSlide(activeSlideIndex + 1);
      break;
    case "print":
      window.print();
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", (event) => {
  if (document.body.classList.contains("is-locked")) return;

  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(activeSlideIndex + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(activeSlideIndex - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }
});
