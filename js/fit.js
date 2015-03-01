export default function(canvas) {
  window.addEventListener('resize', resize, false);
  resize();

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
