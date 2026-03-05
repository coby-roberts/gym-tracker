//
// gym:addExercise
//
export function initExerciseUI() {
  attachMuscleHandlers();
  attachAddExerciseForm();
  populateExercises();
}

// export function unmountExercise() {
//   const form = document.getElementById("add-exercise-form");
//   if (form) {
//     form.removeEventListener("submit", formSubmitHandler);
//   }
//   const addMuscleBtn = document.getElementById("add-muscle");
//   const removeMuscleBtn = document.getElementById("remove-muscle");
//
//   if (addMuscleBtn) {
//     addMuscleBtn.removeEventListener("click", addMuscle);
//   }
//   if (removeMuscleBtn) {
//     removeMuscleBtn.removeEventListener("click", removeMuscle);
//   }
//   const musclesDiv = document.getElementById("muscles");
//   if (musclesDiv) {
//     musclesDiv.innerHTML = '';
//   }
// }

// populate the select with muscles
async function populateMuscleSelect(select) {
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.textContent = "Select Muscle";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  const muscles = await window.gym.getMuscles();
  muscles.forEach(muscle => {
    const option = document.createElement("option");
    option.value = muscle.id;
    option.textContent = muscle.name;
    select.appendChild(option);
  });
}

//=========================================
//      Form Logic
//=========================================

let formSubmitHandler = null;

function attachMuscleHandlers() {
  const addMuscleBtn = document.getElementById("add-muscle");
  const removeMuscleBtn = document.getElementById("remove-muscle");

  if (addMuscleBtn) {
    addMuscleBtn.addEventListener("click", addMuscle);
  }

  if (removeMuscleBtn) {
    removeMuscleBtn.addEventListener("click", removeMuscle);
  }
}

function getMuscleCount() {
  const count = document.getElementById("muscles");
  return count.childElementCount;
}

async function addMuscle() {
  const muscleCount = getMuscleCount()++;

  const musclesDiv = document.getElementById("muscles");

  const muscleSpan = document.createElement("span");
  muscleSpan.id = `muscle-div-${muscleCount}`;
  muscleSpan.className = "input-row";

  const muscleSelect = document.createElement("select");
  muscleSelect.name = "muscles[]";
  muscleSelect.id = `muscle-select-${muscleCount}`;
  muscleSelect.classList.add("muscle-select");

  const muscleLabel = document.createElement("label");
  muscleLabel.innerText = `Muscle ${muscleCount}`;
  muscleLabel.appendChild(muscleSelect);

  muscleSpan.appendChild(muscleLabel);
  musclesDiv.appendChild(muscleSpan);

  // const muscles = await window.gym.getMuscles();
  populateMuscleSelect(muscleSelect);
}

function removeMuscle() {
  const muscleCount = getMuscleCount();
  if (muscleCount === 0) return;
  const muscleDiv = document.getElementById(`muscle-div-${muscleCount}`);
  muscleDiv.remove();
}

// Handle submit of addExercise form
function attachAddExerciseForm() {
  const form = document.getElementById("add-exercise-form");
  if (!form) return;

  formSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const exerciseName = formData.get("exerciseName");
    const muscleIds = formData.getAll("muscles[]");
    window.gym.addExercise(exerciseName, muscleIds);
    form.reset();
  };

  form.addEventListener("submit", formSubmitHandler);
}

//=========================================
//      Exercise Row Logic
//=========================================

function getMuscleRows(container) {
  return Array.from(container.querySelectorAll(".muscle-row"));
}

function getMuscleIds(container) {
  return getMuscleRows(container).map(el => Number(el.dataset.id));
}

function createMuscleRow(muscle) {
  const row = document.createElement("div");
  row.className = "muscle-row";
  row.dataset.id = muscle.id;

  const name = document.createElement("span");
  name.textContent = muscle.name;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.className = "remove-muscle hidden remove-btn";
  removeBtn.onclick = () => row.remove();

  row.append(name, removeBtn);
  return row;
}

async function toggleEditMode({
  exerciseId,
  exerciseNameEl,
  muscleDiv,
  editOnlyDiv,
  editBtn
}) {
  const editing = editBtn.textContent === "Save";

  const originalName = exerciseNameEl.innerText;

  if (editing) {
    // SAVE
    const original = JSON.parse(muscleDiv.dataset.originalMuscles);
    const current = getMuscleIds(muscleDiv);

    const added = current.filter(id => !original.includes(id));
    const removed = original.filter(id => !current.includes(id));

    for (const id of added) {
      await window.gym.addExerciseMuscle(exerciseId, id);
    }

    for (const id of removed) {
      await window.gym.deleteExerciseMuscle(exerciseId, id);
    }

    if (originalName !== exerciseNameEl.innerText.trim()) {
      await window.gym.updateExercise(
        exerciseNameEl.innerText.trim(),
        exerciseId
      );
    }

    muscleDiv.classList.remove("editing");
    editOnlyDiv.style.display = "none";
    exerciseNameEl.contentEditable = false;
    editBtn.textContent = "Edit";
  } else {
    // EDIT
    muscleDiv.dataset.originalMuscles = JSON.stringify(
      getMuscleIds(muscleDiv)
    );

    muscleDiv.classList.add("editing");
    editOnlyDiv.style.display = "block";
    exerciseNameEl.contentEditable = true;
    exerciseNameEl.focus();
    editBtn.textContent = "Save";
  }
}


// Lists each exercise in the db
async function populateExercises() {

  const container = document.getElementById("db-exercises");
  if (!container) return;
  container.innerHTML = "";

  const exercises = await window.gym.getExercisesAndExerciseMuscles();

  for (const row of exercises) {

    const card = document.createElement("div");
    card.className = "exercise-card";

    const exerciseName = document.createElement("h4");
    exerciseName.textContent = row.name;

    const muscleDiv = document.createElement("div");
    muscleDiv.className = "exercise-muscle-list";

    row.muscles.forEach(muscle =>
      muscleDiv.appendChild(createMuscleRow(muscle))
    );

    // edit exercise muscle logic

    const editOnlyDiv = document.createElement("div");
    editOnlyDiv.className = "edit-only";
    editOnlyDiv.style.display = "none";

    const label = document.createElement("label");
    label.innerText = "New Muscle";

    const addMuscleSelect = document.createElement("select");
    addMuscleSelect.className = "edit-select";
    await populateMuscleSelect(addMuscleSelect);

    const addMuscleBtn = document.createElement("button");
    addMuscleBtn.className = "submit-btn";
    addMuscleBtn.innerText = "Submit";

    addMuscleBtn.onclick = () => {
      const id = Number(addMuscleSelect.value);
      if (!id) return;
      if (muscleDiv.querySelector(`[data-id="${id}"]`)) return;

      muscleDiv.appendChild(
        createMuscleRow({
          id,
          name: addMuscleSelect.selectedOptions[0].text
        })
      );
    };

    editOnlyDiv.append(addMuscleSelect, addMuscleBtn);

    const left = document.createElement("div");
    left.className = "left";
    left.append(exerciseName, muscleDiv, editOnlyDiv);


    // add edit button
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.innerText = "Edit";

    editBtn.onclick = async () => toggleEditMode({
      exerciseId: row.id,
      exerciseNameEl: exerciseName,
      muscleDiv,
      editOnlyDiv,
      editBtn
    });

    // add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = async () => {
      await window.gym.deleteExercise(row.id)
      card.remove();
    };

    const buttons = document.createElement("div");
    buttons.className = "buttons";
    buttons.append(editBtn, deleteBtn);

    card.append(left, buttons);
    container.appendChild(card);
  }
}
