export function initMuscleUI() {
  populateMuscles();
  attachAddMuscleForm();
}

// Populate muscles
function populateMuscles() {
  const musclesDiv = document.getElementById("db-muscles"); // div containing muscles stored in the db
  if (!musclesDiv) return;

  musclesDiv.innerHTML = "";

  window.gym.getMuscles().then(muscles => {

    muscles.forEach(muscle => {
      const row = document.createElement("div");
      row.className = "muscle-card";

      const p = document.createElement("p");
      p.id = muscle.id;
      p.innerText = muscle.name;
      p.contentEditable = false;

      // add edit button
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.innerText = "Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = async () => {
        if (p.isContentEditable) {
          await window.gym.updateMuscle(p.innerText, muscle.id);
          p.contentEditable = false;
          editBtn.textContent = "Edit";
        } else {
          p.contentEditable = true;
          p.focus();
          editBtn.textContent = "Save";
        }
      };

      // add delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => {
        window.gym.deleteMuscle(muscle.id)
          .then(() => row.remove());
      };

      const buttons = document.createElement("div");
      buttons.className = "buttons";

      buttons.append(editBtn, deleteBtn);
      row.append(p, buttons);
      musclesDiv.appendChild(row);
    });
  });
}


// Handle submit of addMuscle form
function attachAddMuscleForm() {
  const form = document.getElementById("add-muscle-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    if (!name) return;

    await window.gym.addMuscle(name); // send to main via preload

    // Refresh the dropdown
    populateMuscles();

    // Reset the form
    form.reset();
  });
}


// <div id="db-muscles">
//  <div class="muslce-card">
//    <p>Muscle Name</p>
//    <div class="buttons">
//      <button>Edit</button>
//      <button>Delete</button>
//    </div>
//  </div>
// </div>
