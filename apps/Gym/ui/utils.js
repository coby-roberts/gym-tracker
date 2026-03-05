
// Populate muscles
// function populateHistory(divName, table) {
//   const div = document.getElementById(divName);
//   if (!div) return;
//
//   const tableName = table.charAt(0).toUpperCase() + table.slice(1);
//
//   div.innerHTML = "";
//
//   const result = await window.gym[`get${tableName}s`]();
//
//   result.forEach(row => {
//     const uiRow = document.createElement("div");
//
//     const p = document.createElement("p");
//     p.value = row.id;
//     p.innerText = row.name;
//     p.contentEditable = false;
//
//     // add edit button
//     const editBtn = document.createElement("button");
//     editBtn.type = "button";
//     editBtn.innerText = "Edit";
//
//     editBtn.onclick = async () => {
//       if (p.isContentEditable) {
//         await window.gym[`update${tableName}`](p.innerText, row.id);
//         p.contentEditable = false;
//         editBtn.textContent = "Edit";
//       } else {
//         p.contentEditable = true;
//         p.focus();
//         editBtn.textContent = "Save";
//       }
//     };
//
//     // add delete button
//     const deleteBtn = document.createElement("button");
//     deleteBtn.type = "button";
//     deleteBtn.innerText = "Delete";
//     deleteBtn.onclick = () => {
//       window.gym[`delete${tableName}`](row.id)
//       .then(() => uiRow.remove());
//     };
//
//     uiRow.append(p, editBtn, deleteBtn);
//     div.appendChild(uiRow);
//   });
// }
