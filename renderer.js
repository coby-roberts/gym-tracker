// import { initExerciseUI } from "./apps/Gym/ui/exercise.js";
// import { initMuscleUI } from "./apps/Gym/ui/muscles.js";
// import { initWorkoutUI } from "./apps/Gym/ui/workout.js";
//
// import { initGymUI } from "./apps/Gym/gym.ui.js";
//
const content = document.getElementById("gym-content");

async function loadPage(page) {
  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error(`Could not load ${page}`);

    content.innerHTML = await res.text();

    const { initGymUI } = await import("./apps/Gym/gym.ui.js");
    initGymUI(page);
    updateActiveNav(page);
  } catch (err) {
    console.error("Navigation error: ", err);
  }
}

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
