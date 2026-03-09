import { ipcMain } from "electron";
import * as GymQueries from "./db/queries.js";
import { getDb } from "../../database.js";

export function gymIpc() {
  // Workout

  ipcMain.handle("gym:addWorkout", (event, workout) => {
    const db = getDb();
    return GymQueries.addWorkout(db, workout);
  });

  ipcMain.handle("gym:getWorkouts", (event) => {
    const db = getDb();
    return GymQueries.getWorkouts(db);
  });

  ipcMain.handle("gym:updateWorkout", (event, workout) => {
    const db = getDb();
    return GymQueries.updateWorkout(db, workout);
  });

  ipcMain.handle("gym:deleteWorkout", (event, id) => {
    const db = getDb();
    return GymQueries.deleteWorkout(db, id);
  });

  // Muscles

  ipcMain.handle("gym:addMuscle", (event, name) => {
    const db = getDb();
    const muscleName = String(name);
    return GymQueries.addMuscle(db, muscleName);
  });

  ipcMain.handle("gym:getMuscles", (event) => {
    const db = getDb();
    return GymQueries.getMuscles(db);
  });

  ipcMain.handle("gym:updateMuscle", (event, name, id) => {
    const db = getDb();
    return GymQueries.updateMuscle(db, name, id);
  });

  ipcMain.handle("gym:deleteMuscle", (event, id) => {
    const db = getDb();
    return GymQueries.deleteMuscle(db, id);
  });

  // Exercises

  ipcMain.handle("gym:addExercise", (event, exerciseName, muscleIds) => {
    const db = getDb();
    return GymQueries.addExercise(db, exerciseName, muscleIds);
  });

  ipcMain.handle("gym:updateExercise", (event, name, id) => {
    const db = getDb();
    return GymQueries.updateExercise(db, name, id);
  });

  ipcMain.handle("gym:deleteExercise", (event, id) => {
    const db = getDb();
    return GymQueries.deleteExercise(db, id);
  });

  ipcMain.handle("gym:getExercises", (event) => {
    const db = getDb();
    return GymQueries.getExercises(db);
  });

  ipcMain.handle("gym:getExercisesAndExerciseMuscles", (event) => {
    const db = getDb();
    return GymQueries.getExercisesAndExerciseMuscles(db);
  });

  // Gym Exercise Muscles

  ipcMain.handle("gym:addExerciseMuscle", (event, exerciseId, muscleId) => {
    const db = getDb();
    return GymQueries.addExerciseMuscle(db, exerciseId, muscleId);
  });

  ipcMain.handle("gym:deleteExerciseMuscle", (event, exerciseId, muscleId) => {
    const db = getDb();
    return GymQueries.deleteExerciseMuscle(db, exerciseId, muscleId);
  });

  return { success: true };
}
