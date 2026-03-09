// Workout Session

export function getWorkouts(db) {
  const rows = db
    .prepare(
      `
    SELECT
      s.id AS session_id,
      s.date AS date,
      e.name AS exercise_name,
      se.id AS session_exercise_id,
      se.exercise_id,
      ses.id AS session_exercise_set_id,
      ses.weight,
      ses.reps
    FROM gym_sessions s
    JOIN gym_session_exercises se
      ON se.session_id = s.id
    JOIN gym_session_sets ses
      ON ses.gym_session_exercise_id = se.id
    JOIN gym_exercise e
      ON e.id = se.exercise_id
    ORDER BY s.date`,
    )
    .all();
  console.log(rows);

  const workoutMap = new Map();

  for (const row of rows) {
    if (!workoutMap.has(row.session_id)) {
      workoutMap.set(row.session_id, {
        id: row.session_id,
        date: row.date,
        exercises: new Map(),
      });
    }

    const session = workoutMap.get(row.session_id);

    if (!session.exercises.has(row.session_exercise_id)) {
      session.exercises.set(row.session_exercise_id, {
        id: row.session_exercise_id,
        exerciseId: row.exercise_id,
        name: row.exercise_name,
        sets: [],
      });
    }

    const exercise = session.exercises.get(row.session_exercise_id);

    exercise.sets.push({
      id: row.session_exercise_set_id,
      weight: row.weight,
      reps: row.reps,
    });
  }

  return Array.from(workoutMap.values()).map((session) => ({
    ...session,
    exercises: Array.from(session.exercises.values()),
  }));
}

export function addWorkout(db, workout) {
  console.log(workout);

  const insertSession = db.prepare(`
    INSERT INTO gym_sessions (date) 
    VALUES (?)`);

  const insertSessionExercise = db.prepare(`
    INSERT INTO gym_session_exercises (session_id, exercise_id) 
    VALUES (?, ?)`);

  const insertExerciseSet = db.prepare(`
    INSERT INTO gym_session_sets (gym_session_exercise_id, weight, reps) 
    VALUES (?, ?, ?)`);

  const tx = db.transaction((workout) => {
    const sessionResult = insertSession.run(workout.date);
    const sessionId = sessionResult.lastInsertRowid;

    for (const exercise of workout.exercises) {
      console.log(exercise);
      const exerciseResult = insertSessionExercise.run(
        sessionId,
        exercise.exerciseId,
      );
      const sessionExerciseId = exerciseResult.lastInsertRowid;

      for (const set of exercise.sets) {
        insertExerciseSet.run(sessionExerciseId, set.weight, set.reps);
      }
    }

    return { sessionId };
  });

  return tx(workout);
}

//TODO: complete
export function updateWorkout(db, workout) {
  // const insertSessionExercise = db.prepare();
  // const insertSessionExerciseSet = db.prepare();
  //
  // const removeSessionExercise = db.prepare();
  // const removeSessionExerciseSet = db.prepare();
  //
  // const updateSessionExercise = db.prepare();
  // const updateSessionExerciseSet = db.prepare();
  //
  const tx = db.transaction((workout) => {});

  return tx(workout);
}

export function deleteWorkout(db, id) {
  return db.prepare("DELETE FROM gym_muscles WHERE id = ?").run(id);
}

// Muscles

export function addMuscle(db, name) {
  const result = db
    .prepare("INSERT INTO gym_muscles (name) VALUES (?)")
    .run(name);
  return db
    .prepare("SELECT * FROM gym_muscles WHERE id = ?")
    .get(result.lastInsertRowid);
}

export function getMuscles(db) {
  return db.prepare("SELECT * FROM gym_muscles ORDER BY name").all();
}

export function updateMuscle(db, name, id) {
  return db
    .prepare("UPDATE gym_muscles SET name = ? WHERE id = ?")
    .run(name, id);
}

export function deleteMuscle(db, id) {
  return db.prepare("DELETE FROM gym_muscles WHERE id = ?").run(id);
}

// Exercise

export function addExercise(db, exerciseName, muscleIds) {
  const insertExercise = db.prepare(`
    INSERT INTO gym_exercise (name)
    VALUES (?)
  `);

  const insertExerciseMuscle = db.prepare(`
    INSERT INTO gym_exercise_muscles (exercise_id, muscle_id)
    VALUES (?, ?)
  `);

  const tx = db.transaction((exerciseName, muscleIds) => {
    const result = insertExercise.run(exerciseName);
    const exerciseId = result.lastInsertRowid;

    for (const muscleId of muscleIds) {
      insertExerciseMuscle.run(exerciseId, muscleId);
    }

    return exerciseId;
  });

  return tx(exerciseName, muscleIds);
}

export function updateExercise(db, name, id) {
  try {
    return db
      .prepare("UPDATE gym_exercise SET name = ? WHERE id = ?")
      .run(name, id);
  } catch (error) {
    console.log(error);
  }
}

export function deleteExercise(db, id) {
  const sessionRefs = db
    .prepare("SELECT * FROM gym_session_exercises WHERE exercise_id = ?")
    .all(id);
  const muscleRefs = db
    .prepare("SELECT * FROM gym_exercise_muscles WHERE exercise_id = ?")
    .all(id);

  console.log("session refs:", sessionRefs);
  console.log("muscle refs:", muscleRefs);

  return db.prepare("DELETE FROM gym_exercise WHERE id = ?").run(id);
}

export function getExercises(db) {
  return db.prepare("SELECT * FROM gym_exercise").all();
}

export function getExercisesAndExerciseMuscles(db) {
  const rows = db
    .prepare(
      `
    SELECT
      e.id   AS exercise_id,
      e.name AS exercise_name,
      m.id   AS muscle_id,
      m.name AS muscle_name
    FROM gym_exercise e
    LEFT JOIN gym_exercise_muscles em
      ON em.exercise_id = e.id
    LEFT JOIN gym_muscles m
      ON m.id = em.muscle_id
    ORDER BY e.name
  `,
    )
    .all();

  const exercisesMap = new Map();

  for (const row of rows) {
    if (!exercisesMap.has(row.exercise_id)) {
      exercisesMap.set(row.exercise_id, {
        id: row.exercise_id,
        name: row.exercise_name,
        muscles: [],
      });
    }
    if (row.muscle_id != null) {
      exercisesMap.get(row.exercise_id).muscles.push({
        id: row.muscle_id,
        name: row.muscle_name,
      });
    }
  }

  return Array.from(exercisesMap.values());
}

// gym_exercise_muscles
export function addExerciseMuscle(db, exerciseId, muscleId) {
  return db
    .prepare(
      "INSERT OR IGNORE INTO gym_exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)",
    )
    .run(exerciseId, muscleId);
}

export function deleteExerciseMuscle(db, exerciseId, muscleId) {
  return db
    .prepare(
      "DELETE FROM gym_exercise_muscles WHERE exercise_id = ? AND muscle_id = ?",
    )
    .run(exerciseId, muscleId);
}

// Export
export function exportData(db) {
  const exercises = db.prepare("SELECT * FROM gym_exercise").all();
  const muscles = db.prepare("SELECT * FROM gym_muscles").all();
  const exerciseMuscles = db
    .prepare("SELECT * FROM gym_exercise_muscles")
    .all();
  const sessions = db.prepare("SELECT * FROM gym_sessions").all();
  const sessionExercises = db
    .prepare("SELECT * FROM gym_session_exercises")
    .all();
  const sessionSets = db.prepare("SELECT * FROM gym_session_sets").all();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    exercises,
    muscles,
    exerciseMuscles,
    sessions,
    sessionExercises,
    sessionSets,
  };
}

// Import
export function importData(db, data) {
  const execute = db.transaction((data) => {
    db.prepare("DELETE FROM gym_session_sets").run();
    db.prepare("DELETE FROM gym_session_exercises").run();
    db.prepare("DELETE FROM gym_sessions").run();
    db.prepare("DELETE FROM gym_exercise_muscles").run();
    db.prepare("DELETE FROM gym_exercise").run();
    db.prepare("DELETE FROM gym_muscles").run();

    for (const m of data.muscles)
      db.prepare("INSERT INTO gym_muscles (id, name) VALUES (?, ?)").run(
        m.id,
        m.name,
      );

    for (const e of data.exercises)
      db.prepare("INSERT INTO gym_exercise (id, name) VALUES (?, ?)").run(
        e.id,
        e.name,
      );

    for (const em of data.exerciseMuscles)
      db.prepare(
        "INSERT INTO gym_exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)",
      ).run(em.exercise_id, em.muscle_id);

    for (const s of data.sessions)
      db.prepare("INSERT INTO gym_sessions (id, date) VALUES (?, ?)").run(
        s.id,
        s.date,
      );

    for (const se of data.sessionExercises)
      db.prepare(
        "INSERT INTO gym_session_exercises (id, session_id, exercise_id) VALUES (?, ?, ?)",
      ).run(se.id, se.session_id, se.exercise_id);

    for (const ss of data.sessionSets)
      db.prepare(
        "INSERT INTO gym_session_sets (id, gym_session_exercise_id, weight, reps) VALUES (?, ?, ?, ?)",
      ).run(ss.id, ss.gym_session_exercise_id, ss.weight, ss.reps);
  });

  execute(data);
}
