const carousel = document.querySelector(".carousel");
const arrowButtons = document.querySelectorAll(".main-container i");
const firstItemWidth = carousel.querySelector(".rcm_item").offsetWidth;

let isDragging = false,
  startX,
  startScrollLeft;

arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    carousel.scrollLeft +=
      button.id === "left" ? -firstItemWidth : firstItemWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
