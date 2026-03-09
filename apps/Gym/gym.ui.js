import { initMuscleUI } from "./ui/muscles.js";
import { initWorkoutUI } from "./ui/workout.js";
import { initExerciseUI } from "./ui/exercise.js";

export function initGymUI(currentPage) {
  if (currentPage.includes("addMuscle.html")) {
    initMuscleUI();
  } else if (currentPage.includes("addExercise.html")) {
    initExerciseUI();
  } else if (currentPage.includes("addWorkout.html")) {
    initWorkoutUI();
  }
}
