const convertStyle = () => {
  document.body.style.setProperty("height", `${window.innerHeight}px`);
};

window.addEventListener("resize", convertStyle);
window.addEventListener("DOMContentLoaded", convertStyle);

window.onload = function () {
  document.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  var lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      var now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
};
