let index = 0;

const slider = document.getElementById("slides");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const dotsContainer = document.getElementById("dots");

// Render Page Content from embedded genreData
function renderBacklog() {
  if (typeof genreData === "undefined") return;

  // Set overall slider width based on number of subcategories
  slider.style.width = `${genreData.length * 100}vw`;

  // Render Panels
  slider.innerHTML = genreData.map(cat => `
    <div class="panel">
      <h1>${cat.category}</h1>
      <div class="content">
        <div class="games">
          ${cat.games.map(game => {
            // Support object format { name, appId, psUrl } or plain string
            const name = typeof game === "object" ? game.name : game;
            const appId = typeof game === "object" ? (game.appId || "") : "";
            const psUrl = typeof game === "object" ? (game.psUrl || "") : "";
            
            return `<div class="game" data-appid="${appId}" data-psurl="${psUrl}">${name}</div>`;
          }).join('')}
        </div>
        <div class="covers">
          ${cat.covers.map(img => `<img src="${img}" alt="Cover" loading="lazy">`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Generate Navigation Dots
  dotsContainer.innerHTML = "";
  genreData.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  // Attach Store links to all game cards
  document.querySelectorAll(".game").forEach((gameCard) => {
    gameCard.addEventListener("click", () => {
      const appId = gameCard.dataset.appid;
      const psUrl = gameCard.dataset.psurl;
      const gameName = gameCard.innerText.replace("🎃", "").trim();

      if (appId && appId !== "") {
        // Direct link to Steam store page
        window.open(`https://store.steampowered.com/app/${appId}/`, "_blank");
      } else if (psUrl && psUrl !== "") {
        // Direct link to PlayStation Store
        window.open(psUrl, "_blank");
      } else {
        // Fallback search if no direct store link is provided
        window.open(`https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`, "_blank");
      }
    });
  });

  updateUI();
}

// Update slider position, progress bar, dots, and navigation buttons
function updateUI() {
  slider.style.transform = `translateX(-${index * 100}vw)`;

  // Update dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => dot.classList.toggle("active", i === index));

  // Update progress bar and buttons if genreData exists
  if (typeof genreData !== "undefined") {
    const progressPercent = ((index + 1) / genreData.length) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    if (prevBtn) prevBtn.classList.toggle("disabled", index === 0);
    if (nextBtn) nextBtn.classList.toggle("disabled", index === genreData.length - 1);
  }
}

function goToSlide(n) {
  index = n;
  updateUI();
}

function next() {
  if (typeof genreData !== "undefined" && index < genreData.length - 1) {
    index++;
    updateUI();
  }
}

function prev() {
  if (index > 0) {
    index--;
    updateUI();
  }
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") next();
  if (event.key === "ArrowLeft") prev();
});

// Touch & Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) next();
  if (touchEndX - touchStartX > 50) prev();
});

// Initialize on page load
renderBacklog();
