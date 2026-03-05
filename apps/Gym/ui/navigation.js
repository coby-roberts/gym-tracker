let navigationClickHandler = null;

export function initNavigation({ onAddMusclePage, onAddExercisePage, onAddWorkoutPage }) {

  async function loadGymPage(page, onLoad) {
    const gymContent = document.getElementById("gym-content");
    const res = await fetch(page);
    gymContent.innerHTML = await res.text();
    if (onLoad) onLoad();
  }

  // initial page
  loadGymPage("./apps/Gym/pages/stats.html");

  navigationClickHandler = (e) => {
    const btn = e.target.closest(".gym-menu button");
    if (!btn) return;

    loadGymPage(btn.dataset.subpage, () => {
      if (btn.dataset.subpage.endsWith("addMuscle.html")) onAddMusclePage?.();
      if (btn.dataset.subpage.endsWith("addExercise.html")) onAddExercisePage?.();
      if (btn.dataset.subpage.endsWith("addWorkout.html")) onAddWorkoutPage?.();
    });
  };

  document.addEventListener("click", navigationClickHandler);
}

export function unmountNavigation() {
  if (navigationClickHandler) {
    document.removeEventListener("click", navigationClickHandler);
    navigationClickHandler = null;
  }
}
