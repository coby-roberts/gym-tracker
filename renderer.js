const content = document.getElementById("gym-content");
const { initGlobalUI, initGymUI } = await import("./apps/Gym/gym.ui.js");

async function loadPage(page) {
  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error(`Could not load ${page}`);
    content.innerHTML = await res.text();
    initGymUI(page);
    updateActiveNav(page);
  } catch (err) {
    console.error("Navigation error: ", err);
  }
}

window.loadPage = loadPage;

function updateActiveNav(activePage) {
  document.querySelectorAll(".main-nav button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === activePage);
  });
}

document.querySelectorAll(".main-nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    loadPage(btn.dataset.page, btn.dataset.app);
  });
});

// Default landing page
loadPage("apps/Gym/pages/stats.html");
updateActiveNav("apps/Gym/pages/stats.html");
initGlobalUI();
