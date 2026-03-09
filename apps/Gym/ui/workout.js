//
// addWorkout.html
//

//TODO: the workout form doesnt reset after submitting the form.
//      After pressing submit the page should also fetch the new row.
//      The excersise count also needs to be reset whenever exiting the page.

export function initWorkoutUI() {
  attachWorkoutHandlers();
  attachWorkoutDelegation();
  attachAddWorkoutForm();
  populateWorkouts();
}

export function closeWorkoutUI() {
  detatchWorkoutHandlers();
  detachWorkoutDelegation();
}

function getExerciseCount() {
  const exercises = document.getElementById("exercises");
  return exercises.childElementCount;
}

function getSetCount(setsId) {
  const exercise = document.getElementById(`sets-${setsId}`);
  return exercise.childElementCount;
}

function handleAddExercise() {
  addExercise(getExerciseCount() + 1);
}

function attachWorkoutHandlers() {
  document
    .getElementById("add-exercise")
    .addEventListener("click", handleAddExercise);

  document
    .getElementById("remove-exercise")
    .addEventListener("click", removeLastExercise);
}

function detatchWorkoutHandlers() {
  document
    .getElementById("add-exercise")
    .removeEventListener("click", handleAddExercise);

  document
    .getElementById("remove-exercise")
    .removeEventListener("click", removeLastExercise);
}

let workoutClickHandler;

function attachWorkoutDelegation() {
  if (workoutClickHandler) return; // guard

  workoutClickHandler = (e) => {
    const btn = e.target.closest(".add-btn, .remove-btn");
    if (!btn) return;

    const exerciseId = btn.dataset.exercise;
    const setsDiv = document.getElementById(`sets-${exerciseId}`);

    if (btn.classList.contains("add-btn")) {
      addSet(setsDiv, exerciseId);
    } else if (btn) {
      removeSet(setsDiv);
    }
  };

  document
    .getElementById("exercises")
    .addEventListener("click", workoutClickHandler);
}

function detachWorkoutDelegation() {
  if (!workoutClickHandler) return;

  document
    .getElementById("exercises")
    .removeEventListener("click", workoutClickHandler);

  workoutClickHandler = null;
}

function removeLastExercise() {
  const exercisesContainer = document.getElementById("exercises");
  const lastExercise = exercisesContainer.lastElementChild;

  if (!lastExercise) return;

  lastExercise.remove();
}

// Add an exercise to the workout form
async function addExercise(exerciseCount) {
  const exerciseDiv = document.createElement("div");
  exerciseDiv.className = "exercise";
  exerciseDiv.id = `exercise-div-${exerciseCount}`;

  const exerciseNumDiv = document.createElement("div");
  exerciseNumDiv.innerText = exerciseCount;
  exerciseNumDiv.className = "exercise-number";

  const select = document.createElement("select");
  select.name = `exercise-${exerciseCount}`;

  const exercises = await window.gym.getExercises();
  populateExerciseSelect(select, exercises);

  const setsDiv = document.createElement("div");
  setsDiv.className = "sets";
  setsDiv.id = `sets-${exerciseCount}`;

  const addSetBtn = document.createElement("button");
  addSetBtn.id = `add-set-${exerciseCount}`;
  addSetBtn.className = "add-btn";
  addSetBtn.textContent = "Add Set";
  addSetBtn.type = "button";
  // addSetBtn.dataset.exercise = exerciseCount;
  addSetBtn.addEventListener("click", () => addSet(setsDiv, exerciseCount));

  const removeSetBtn = document.createElement("button");
  removeSetBtn.id = `remove-set-${exerciseCount}`;
  removeSetBtn.className = "remove-btn";
  removeSetBtn.textContent = "Remove Set";
  removeSetBtn.type = "button";
  // removeSetBtn.dataset.exercise = exerciseCount;
  removeSetBtn.addEventListener("click", () => removeSet(setsDiv));

  const topExerciseRow = document.createElement("div");
  topExerciseRow.className = "exercise-select-div";
  topExerciseRow.append(exerciseNumDiv, select);

  const addRemoveSetDiv = document.createElement("div");
  addRemoveSetDiv.className = "buttons";
  addRemoveSetDiv.append(removeSetBtn, addSetBtn);

  exerciseDiv.append(topExerciseRow, setsDiv, addRemoveSetDiv);
  document.getElementById("exercises").appendChild(exerciseDiv);
}

function addSet(parent, exerciseId) {
  const setIndex = getSetCount(exerciseId) + 1;

  const setDiv = document.createElement("div");
  setDiv.className = "set";
  setDiv.id = `set-${exerciseId}-${setIndex}`;
  setDiv.innerHTML = `
    <label>Reps <input name="reps-${exerciseId}[]" type="number" min="1" max="250" placeholder="0"></label>
    <label>Weight <input name="weight-${exerciseId}[]" type="number" min="0" max="1000" step="2.5" placeholder="kg"></label>
  `;

  parent.appendChild(setDiv);
}

function removeSet(parent) {
  parent.lastElementChild?.remove();
}

// populate the select with muscles
function populateExerciseSelect(select, exercises) {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select Exercise";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  exercises.forEach((exercise) => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = exercise.name;
    select.appendChild(option);
  });
}

function attachAddWorkoutForm() {
  const form = document.getElementById("add-workout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const workout = {
      date: new FormData(form).get("date"),
      exercises: [],
    };

    const exerciseDivs = document.querySelectorAll("[id^='exercise-']");

    exerciseDivs.forEach((exerciseDiv) => {
      const exerciseId = exerciseDiv.querySelector("select").value;
      if (!exerciseId) return;

      const sets = [];

      exerciseDiv.querySelectorAll(".set").forEach((setDiv) => {
        const weight = setDiv.querySelector("input[name^='weight']").value;
        const reps = setDiv.querySelector("input[name^='reps']").value;

        if (weight && reps) {
          sets.push({
            weight: Number(weight),
            reps: Number(reps),
          });
        }
      });

      if (sets.length) {
        workout.exercises.push({
          exerciseId: Number(exerciseId),
          sets,
        });
      }
    });

    console.log(workout);

    await window.gym.addWorkout(workout);

    form.reset();
  });
}

//TODO: update this from exercise to workouts

// async function toggleEditMode({
//   workoutId,
//   workoutDate,
//   muscleDiv,
//   editOnlyDiv,
//   editBtn
// }) {
//   const editing = editBtn.textContent === "Save";
//
//   const originalName = exerciseNameEl.innerText;
//
//   if (editing) {
//     // SAVE
//     const original = JSON.parse(muscleDiv.dataset.originalMuscles);
//     const current = getMuscleIds(muscleDiv);
//
//     const added = current.filter(id => !original.includes(id));
//     const removed = original.filter(id => !current.includes(id));
//
//     for (const id of added) {
//       await window.gym.addExerciseMuscle(exerciseId, id);
//     }
//
//     for (const id of removed) {
//       await window.gym.deleteExerciseMuscle(exerciseId, id);
//     }
//
//     if (originalName !== exerciseNameEl.innerText.trim()) {
//       await window.gym.updateExercise(
//         exerciseNameEl.innerText.trim(),
//         exerciseId
//       );
//     }
//
//     muscleDiv.classList.remove("editing");
//     editOnlyDiv.style.display = "none";
//     exerciseNameEl.contentEditable = false;
//     editBtn.textContent = "Edit";
//   } else {
//     // EDIT
//     muscleDiv.dataset.originalMuscles = JSON.stringify(
//       getMuscleIds(muscleDiv)
//     );
//
//     muscleDiv.classList.add("editing");
//     editOnlyDiv.style.display = "block";
//     exerciseNameEl.contentEditable = true;
//     exerciseNameEl.focus();
//     editBtn.textContent = "Save";
//   }
// }

function createSetRow(set) {
  const setRepWeight = document.createElement("p");
  setRepWeight.innerText = `${set.reps} x ${set.weight}`;

  const setDiv = document.createElement("div");
  setDiv.className = "set";

  setDiv.appendChild(setRepWeight);
  return setDiv;
}

async function populateWorkouts() {
  const container = document.getElementById("db-workouts");
  if (!container) {
    console.log("Returning: db-workouts not found.");
    return;
  }
  container.innerHTML = "";

  const workouts = await window.gym.getWorkouts();

  for (const row of workouts) {
    const workout = document.createElement("div");
    workout.className = "workout-card";

    const workoutDate = document.createElement("h3");
    workoutDate.value = row.id;
    workoutDate.innerText = row.date;
    workoutDate.contentEditable = false;

    const left = document.createElement("div");
    left.className = "left";

    const exercises = document.createElement("div");
    exercises.className = "exercises";

    row.exercises.forEach((exercise) => {
      const exerciseDiv = document.createElement("div");
      exerciseDiv.className = "exercise";

      const sets = document.createElement("div");
      sets.className = "sets";

      const exerciseName = document.createElement("h3");
      exerciseName.value = exercise.id;
      exerciseName.innerText = exercise.name;

      exercise.sets.forEach((set) => sets.appendChild(createSetRow(set)));

      exerciseDiv.append(exerciseName, sets);
      exercises.appendChild(exerciseDiv);
    });

    left.append(workoutDate, exercises);

    // add edit button
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.innerText = "Edit";

    // editBtn.onclick = async () => toggleEditMode({
    //   workoutId: row.id,
    //   workoutDate,
    //   exercises
    // });

    // add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = () => {
      window.gym.deleteWorkout(row.id).then(() => workout.remove());
    };

    const buttons = document.createElement("buttons");
    buttons.className = "buttons";
    buttons.append(editBtn, deleteBtn);

    workout.append(left, buttons);
    container.appendChild(workout);
  }
}
