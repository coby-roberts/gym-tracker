import { initWorkoutUI } from "./ui/workout.js";
import { initExerciseUI } from "./ui/exercise.js";
import { initErrorBanner } from "./ui/error-banner.js";

export function initGlobalUI() {
  initErrorBanner();
}

export function initGymUI(currentPage) {
  console.log("initGymUI called with:", currentPage);
  if (currentPage.includes("addExercise.html")) initExerciseUI();
  else if (currentPage.includes("addWorkout.html")) initWorkoutUI();
}
