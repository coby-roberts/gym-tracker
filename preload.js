const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("gym", {
  // muscles
  addMuscle: (name) => ipcRenderer.invoke("gym:addMuscle", name),

  getMuscles: () => ipcRenderer.invoke("gym:getMuscles"),

  updateMuscle: (name, id) => ipcRenderer.invoke("gym:updateMuscle", name, id),

  deleteMuscle: (id) => ipcRenderer.invoke("gym:deleteMuscle", id),

  // exercises
  addExercise: (exerciseName, muscleIds) =>
    ipcRenderer.invoke("gym:addExercise", exerciseName, muscleIds),

  updateExercise: (name, id) =>
    ipcRenderer.invoke("gym:updateExercise", name, id),

  deleteExercise: (id) => ipcRenderer.invoke("gym:deleteExercise", id),

  getExercises: () => ipcRenderer.invoke("gym:getExercises"),

  getExercisesAndExerciseMuscles: () =>
    ipcRenderer.invoke("gym:getExercisesAndExerciseMuscles"),

  // workouts
  addWorkout: (workout) => ipcRenderer.invoke("gym:addWorkout", workout),

  getWorkouts: () => ipcRenderer.invoke("gym:getWorkouts"),

  updateWorkout: (workout) => ipcRenderer.invoke("gym:updateWorkout", workout),

  deleteWorkout: (id) => ipcRenderer.invoke("gym:deleteWorkout", id),

  // gym exercise muscles
  addExerciseMuscle: (exerciseId, muscleId) =>
    ipcRenderer.invoke("gym:addExerciseMuscle", exerciseId, muscleId),

  deleteExerciseMuscle: (exerciseId, muscleId) =>
    ipcRenderer.invoke("gym:deleteExerciseMuscle", exerciseId, muscleId),
});
