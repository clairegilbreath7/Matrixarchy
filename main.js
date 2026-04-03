/* ── DOM references ── */
const splash     = document.getElementById("splash");
const splashText = document.getElementById("splashText");
const sequence   = document.getElementById("sequence");
const slides     = document.querySelectorAll(".slide");

/* ── Blink the title on the splash screen ── */
let splashVisible = true;
setInterval(() => {
  splashVisible = !splashVisible;
  splashText.style.visibility = splashVisible ? "visible" : "hidden";
}, 500);

let currentStep = 0;
let busy = false;
let tileNodes = [];

/* ── Build tiles over a specific element and animate them away ── */
function revealWithTiles(slide, color) {
  const rect = slide.getBoundingClientRect();
  const blockW = 200, blockH = 140;
  const cols = Math.ceil(rect.width  / blockW);
  const rows = Math.ceil(rect.height / blockH);

  // remove previous tiles
  tileNodes.forEach(t => t.remove());
  tileNodes = [];

  let count = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const div = document.createElement("div");
      div.className = "tile";
      div.style.left = `${rect.left + x * blockW}px`;
      div.style.top  = `${rect.top  + y * blockH}px`;
      div.style.background = color;
      div.style.setProperty("--delay", `${count * 10}ms`);
      document.body.appendChild(div);
      tileNodes.push(div);
      count++;
    }
  }

  tileNodes.forEach(t => {
    void t.offsetWidth;
    t.classList.add("reveal");
  });

  setTimeout(() => { busy = false; }, count * 10 + 200);
}

/* ── Show a slide ── */
function showStep(i) {
  currentStep = i;
  if (i >= slides.length) return;

  busy = true;
  slides.forEach(s => s.classList.add("hidden"));

  const slide = slides[i];
  const isReload = slide.classList.contains("reload-state");

  if (slide.tagName === "IMG") {
    slide.style.animation = "none";
    void slide.offsetWidth;
    slide.style.animation = "";
  }

  slide.classList.remove("hidden");
  revealWithTiles(slide, isReload ? "#000000" : "#29ED07");
}

/* ── Advance on click; RELOAD returns to splash ── */
function advanceStep() {
  if (busy) return;
  if (slides[currentStep].classList.contains("reload-state")) {
    slides.forEach(s => s.classList.add("hidden"));
    sequence.classList.add("hidden");
    splash.classList.remove("hidden");
    currentStep = 0;
    return;
  }
  showStep(currentStep + 1);
}

/* ── Events ── */
splash.addEventListener("click", () => {
  splash.classList.add("hidden");
  sequence.classList.remove("hidden");
  showStep(0);
});

document.addEventListener("click", () => {
  if (!splash.classList.contains("hidden")) return;
  advanceStep();
});
