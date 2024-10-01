class Slide {
  constructor(slide, displayName, delayTime) {
    this.slideItems = document.querySelectorAll(`.${slide} .${slide}-item`);
    this.slideDots = document.querySelectorAll(`.${slide} .slide-control-item`);
    this.nextBtn = document.querySelector(`.${slide} .chevron-right`);
    this.preBtn = document.querySelector(`.${slide} .chevron-left`);
    this.displayName = displayName;
    this.delayTime = delayTime;
    this.currentIndex = 0;
    this.intervalID;
  }

  start() {
    // Show first item when app started
    this.showItem();

    // Handle event when chevron is clicked
    this.preBtn.addEventListener("click", () => this.preSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Handle event when dot is clicked
    this.slideDots.forEach((dotItem, index) => {
      dotItem.addEventListener("click", () => this.showClickedSlide(index));
    });

    if (this.delayTime) {
      // Start slide in large window
      if (window.innerWidth > 909) {
        this.intervalID = setInterval(() => this.nextSlide(), this.delayTime);
      }

      window.addEventListener("resize", () => {
        clearInterval(this.intervalID);
        if (window.innerWidth > 909) {
          this.intervalID = setInterval(() => this.nextSlide(), this.delayTime);
        }
      });
    }
  }

  showItem() {
    this.slideItems[this.currentIndex].style.display = this.displayName;
    if (this.slideDots.length) {
      this.slideDots[this.currentIndex].classList.add("active");
    }
  }

  hideItem() {
    this.slideItems[this.currentIndex].style.display = "none";
    if (this.slideDots.length) {
      this.slideDots[this.currentIndex].classList.remove("active");
    }
  }

  showClickedSlide(index) {
    this.hideItem();
    this.currentIndex = index;
    this.showItem();
  }

  preSlide() {
    // Clear interval and set new interval
    if (this.delayTime) {
      clearInterval(this.intervalID);
      this.intervalID = setInterval(() => this.nextSlide(), this.delayTime);
    }

    this.hideItem();
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.slideItems.length - 1;
    }
    this.showItem();
  }

  nextSlide() {
    // Clear interval and set new interval
    if (this.delayTime) {
      clearInterval(this.intervalID);
      this.intervalID = setInterval(() => this.nextSlide(), this.delayTime);
    }

    this.hideItem();
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex >= this.slideItems.length) {
      this.currentIndex = 0;
    }
    this.showItem();
  }
}

export { Slide };
