const slides = Array.from(document.querySelectorAll(".slide"));
const tocLinks = Array.from(document.querySelectorAll(".toc__link"));
const counter = document.querySelector("#slide-counter");

function updateActiveSlide(index) {
  tocLinks.forEach((link, linkIndex) => {
    link.classList.toggle("is-active", linkIndex === index);
  });

  if (counter) {
    counter.textContent = `${index + 1} / ${slides.length}`;
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
    case "print":
      window.print();
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", (event) => {
  const currentIndex = tocLinks.findIndex((link) => link.classList.contains("is-active"));

  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(currentIndex + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(currentIndex - 1);
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
