export default function slider() {
  const $container = document.getElementById("main");
  const $buttons = [...document.getElementsByClassName("slider-button")];
  const [$previousButton, $nextButton] = $buttons;
  const $firstImage = document.getElementById("first-image");
  const SCROLL_TRIGGER = 50;

  const methods = {
    getImageWidth() {
      return $firstImage.getBoundingClientRect().width;
    },

    scrollTo(next) {
      const gapPixel = getComputedStyle(document.body).getPropertyValue("--gap");
      const gap = parseInt(gapPixel, 10);
      const totalGap = (next - 1) * gap;

      const paddingYPixel = getComputedStyle(document.body).getPropertyValue("--padding-y");
      const paddingY = next === 0 ? 0 : parseInt(paddingYPixel, 10);

      const nextPosition = next * imageWidth + totalGap + paddingY;
      $container.scrollTo({ top: 0, left: nextPosition, behavior: "smooth" });
    },

    updateButtonsPosition() {
      const { y, height } = $firstImage.getBoundingClientRect();
      const sliderSizePixel = getComputedStyle(document.body).getPropertyValue("--slider-button-size");
      const sliderSize = parseInt(sliderSizePixel, 10);
      $buttons.forEach((button) => {
        button.style.top = `${y + height / 2 - sliderSize / 2}px`;
      });
    },

    updateButtonsVisibility() {
      const shouldDisplayPrevious = $container.scrollLeft > SCROLL_TRIGGER;
      if (shouldDisplayPrevious) {
        $previousButton.classList.add("slider-button--visible");
      } else {
        $previousButton.classList.remove("slider-button--visible");
      }

      const shouldDisplayNext =
        $container.scrollLeft < $container.scrollWidth - $container.getBoundingClientRect().width - SCROLL_TRIGGER;
      if (shouldDisplayNext) {
        $nextButton.classList.add("slider-button--visible");
      } else {
        $nextButton.classList.remove("slider-button--visible");
      }
    },
  };

  let imageWidth = methods.getImageWidth();
  methods.updateButtonsVisibility();
  $firstImage.onload = methods.updateButtonsPosition;

  window.addEventListener("resize", () => {
    methods.updateButtonsVisibility();
    methods.updateButtonsPosition();
    imageWidth = methods.getImageWidth();
  });

  $container.addEventListener("scroll", methods.updateButtonsVisibility);

  $previousButton.addEventListener("click", () => {
    const current = Number(($container.scrollLeft / imageWidth).toFixed(0));
    const next = Math.max(current - 1, 0);
    methods.scrollTo(next);
  });

  $nextButton.addEventListener("click", () => {
    const current = Number(($container.scrollLeft / imageWidth).toFixed(0));
    const next = Math.min(current + 1, 5);
    methods.scrollTo(next);
  });
}
