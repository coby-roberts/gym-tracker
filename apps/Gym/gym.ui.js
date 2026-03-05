import { initNavigation } from "./ui/navigation.js";
import { initMuscleUI } from "./ui/muscles.js";
import { initWorkoutUI } from "./ui/workout.js";
import { initExerciseUI } from "./ui/exercise.js";

export function initGymUI() {
  initNavigation({
    onAddMusclePage: () => {
      initMuscleUI();
    },
    onAddExercisePage: () => {
      initExerciseUI();
    },
    onAddWorkoutPage: () => {
      initWorkoutUI();
    }
  });
}
